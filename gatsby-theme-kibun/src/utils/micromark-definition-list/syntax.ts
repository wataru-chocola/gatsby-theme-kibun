import {
  Construct,
  Extension,
  State,
  Code,
  Event,
  Effects,
  TokenizeContext,
} from 'micromark-util-types';
import { codes } from 'micromark-util-symbol/codes';
import { types } from 'micromark-util-symbol/types';
import { factorySpace } from 'micromark-factory-space';
import { constants } from 'micromark-util-symbol/constants.js';
import { markdownSpace } from 'micromark-util-character';
import { blankLine } from 'micromark-core-commonmark/dev/lib/blank-line';
import { tokenTypes } from './types';
import assert from 'assert';

interface TokenizeContextWithDefState extends TokenizeContext {
  containerState?: {
    _closeFlow?: boolean;
    size?: number;
    type?: string;
    initialBlankLine?: boolean;
    furtherBlankLines?: boolean;
  } & Record<string, unknown>;
}

const defListConstruct: Construct = {
  name: 'defList',
  tokenize: tokenizeDefListStart,
  continuation: {
    tokenize: tokenizeDefListContinuation,
  },
  resolveAll: resolveAllDefinitionTerm,
  exit: tokenizeDefListEnd,
};

const defListDescriptionPrefixWhitespaceConstruct: Construct = {
  tokenize: tokenizeDefListDescriptionPrefixWhitespace,
  partial: true,
};

const indentConstruct = { tokenize: tokenizeIndent, partial: true };

export const defList: Extension = {
  document: { [codes.colon]: defListConstruct, null: [] },
};

function inspectEvents(events: Event[] | undefined): void {
  if (events == null) {
    return;
  }
  events.forEach((x) => {
    let content = '';
    try {
      content = x[2].sliceSerialize(x[1], true);
    } catch (e) {
      content = '<maybe incomplete token>';
    }
    console.log([x[0], x[1].type, content]);
  });
}

function resolveAllDefinitionTerm(events: Event[], context: TokenizeContext): Event[] {
  console.log('resolveAll');
  inspectEvents(events);

  let index = events.length;
  while (index--) {
    if (events[index][0] === 'exit' && events[index][1].type === tokenTypes.defList) {
      events = resolveDefinitionTermTo(index, events, context);
    }
  }

  console.log('modified events');
  inspectEvents(events);
  return events;
}

function resolveDefinitionTermTo(to: number, events: Event[], context: TokenizeContext): Event[] {
  let index = to;
  let defList_start: number | undefined;
  while (index--) {
    if (events[index][0] === 'enter' && events[index][1].type === tokenTypes.defList) {
      defList_start = index;
      break;
    }
    if (events[index][0] === 'exit' && events[index][1].type === tokenTypes.defList) {
      // nested defList
      events = resolveDefinitionTermTo(index, events, context);
    }
  }
  assert(defList_start !== undefined, 'expected a start of defList found');

  let flowIndex: number | undefined;
  if (events[defList_start - 1][1].type === types.chunkFlow) {
    flowIndex = defList_start - 1;
  }
  assert(flowIndex !== undefined, 'expected a chunkFlow found');
  const flowEvents = events[flowIndex][1]._tokenizer!.events;

  let inParagraph = false;
  let paraStart: any | undefined;
  let paraEnd: any | undefined;
  for (let i = flowEvents.length - 1; i >= 0; i--) {
    const tmpEvent = flowEvents[i];
    if (tmpEvent[0] === 'exit' && tmpEvent[1].type === types.paragraph) {
      inParagraph = true;
      paraEnd = tmpEvent[1].end;
    }
    if (tmpEvent[0] === 'enter' && tmpEvent[1].type === types.paragraph) {
      paraStart = tmpEvent[1].start;
      break;
    }
    if (!inParagraph) {
      continue;
    }
  }

  let flowIndex_exit: number | undefined;
  let startIndex = 0;
  const defListEnterEvent = events[defList_start];
  events.splice(defList_start, 1);
  for (let i = flowIndex; i >= 0; i--) {
    if (events[i][1].type !== types.chunkFlow) {
      startIndex = i + 1;
      break;
    }
    if (events[i][1].start.offset < paraStart.offset) {
      startIndex = i + 1;
      break;
    }
    if (events[i][1].start.offset > paraEnd.offset) {
      continue;
    }

    if (events[i][0] === 'enter') {
      assert(flowIndex_exit != null, 'expect a flow index exit');
      events[i][1].type = types.chunkText;

      const termToken = {
        type: tokenTypes.defListTerm,
        start: Object.assign({}, events[i][1].start),
        end: Object.assign({}, events[i][1].end),
      };
      events.splice(flowIndex_exit + 1, 0, ['exit', termToken, context]);
      events.splice(i, 0, ['enter', termToken, context]);

      flowIndex_exit = undefined;
    } else {
      flowIndex_exit = i;
    }
  }

  defListEnterEvent[1].start = Object.assign({}, events[startIndex][1].start);
  events.splice(startIndex, 0, defListEnterEvent);

  return events;
}

function tokenizeDefListStart(
  this: TokenizeContextWithDefState,
  effects: Effects,
  ok: State,
  nok: State,
): State {
  console.log('initialize tokenizer');
  const self = this; // eslint-disable-line @typescript-eslint/no-this-alias
  if (self.containerState == null) {
    self.containerState = {};
  }

  const tail = self.events[self.events.length - 1];
  let initialSize =
    tail && tail[1].type === types.linePrefix ? tail[2].sliceSerialize(tail[1], true).length : 0;

  if (self.parser.lazy[self.now().line]) {
    // in the middle of blockquote or something
    return nok;
  }

  let index = self.events.length;
  let flowEvents: Event[] | undefined;
  while (index--) {
    if (self.events[index][1].type === types.chunkFlow) {
      flowEvents = self.events[index][1]._tokenizer?.events;
      break;
    }
  }

  let paragraph = false;
  if (flowEvents) {
    let tmpIndex = flowEvents.length;
    while (tmpIndex--) {
      if (
        flowEvents[tmpIndex][1].type !== types.lineEnding &&
        flowEvents[tmpIndex][1].type !== types.linePrefix &&
        flowEvents[tmpIndex][1].type !== types.lineEndingBlank &&
        flowEvents[tmpIndex][1].type !== types.content
      ) {
        paragraph = flowEvents[tmpIndex][1].type === types.paragraph;
        break;
      }
    }
  }

  if (self.containerState!.type == null) {
    if (self.interrupt || paragraph) {
      // start defList only when definition term found.
      effects.enter(tokenTypes.defList, { _container: true });
      self.containerState!.type = tokenTypes.defList;
    } else {
      return nok;
    }
  }

  return start;

  function start(code: Code): State | void {
    console.log('start: start' + String(code));
    if (code !== codes.colon) {
      return nok(code);
    }

    effects.enter(tokenTypes.defListDescription);
    effects.enter(tokenTypes.defListDescriptionPrefix);
    effects.enter(tokenTypes.defListDescriptionMarker);
    effects.consume(code);
    effects.exit(tokenTypes.defListDescriptionMarker);

    return effects.check(
      blankLine,
      onBlank,
      effects.attempt(defListDescriptionPrefixWhitespaceConstruct, prefixEnd, otherPrefix),
    );
  }

  function onBlank(code: Code): State | void {
    console.log('start: on blank');
    self.containerState!.initialBlankLine = true;
    initialSize++;
    return prefixEnd;
  }

  function otherPrefix(code: Code): State | void {
    console.log('start: other prefix');
    if (markdownSpace(code)) {
      effects.enter(tokenTypes.defListDescriptionPrefixWhitespace);
      effects.consume(code);
      effects.exit(tokenTypes.defListDescriptionPrefixWhitespace);
      return prefixEnd;
    }
    return nok(code);
  }

  function prefixEnd(code: Code): State | void {
    console.log('start: prefix end');
    self.containerState!.size =
      initialSize +
      self.sliceSerialize(effects.exit(tokenTypes.defListDescriptionPrefix), true).length;

    return ok(code);
  }
}

function tokenizeDefListContinuation(
  this: TokenizeContextWithDefState,
  effects: Effects,
  ok: State,
  nok: State,
): State {
  const self = this; // eslint-disable-line @typescript-eslint/no-this-alias
  self.containerState!._closeFlow = undefined;
  return effects.check(blankLine, onBlank, notBlank);

  function onBlank(code: Code): State | void {
    console.log('continuous: on blank');
    self.containerState!.furtherBlankLines =
      self.containerState!.furtherBlankLines || self.containerState!.initialBlankLine;

    return factorySpace(
      effects,
      ok,
      tokenTypes.defListDescriptionIndent,
      self.containerState!.size! + 1,
    )(code);
  }

  function notBlank(code: Code): State | void {
    console.log('continuous: not blank');
    if (self.containerState!.furtherBlankLines || !markdownSpace(code)) {
      self.containerState!.furtherBlankLines = undefined;
      self.containerState!.initialBlankLine = undefined;
      return notInCurrentItem(code);
    }

    self.containerState!.furtherBlankLines = undefined;
    self.containerState!.initialBlankLine = undefined;
    return effects.attempt(indentConstruct, ok, notInCurrentItem)(code);
  }

  function notInCurrentItem(code: Code): State | void {
    console.log('continuous: not in current item');
    self.containerState!._closeFlow = true;
    self.interrupt = undefined;

    effects.exit(tokenTypes.defListDescription);

    return factorySpace(
      effects,
      effects.attempt(defListConstruct, ok, nok),
      types.linePrefix,
      self.parser.constructs.disable.null.includes('codeIndented') ? undefined : constants.tabSize,
    )(code);
  }
}

function tokenizeIndent(
  this: TokenizeContextWithDefState,
  effects: Effects,
  ok: State,
  nok: State,
): State {
  const self = this; // eslint-disable-line @typescript-eslint/no-this-alias

  return factorySpace(
    effects,
    afterPrefix,
    tokenTypes.defListDescriptionIndent,
    self.containerState!.size! + 1,
  );

  function afterPrefix(code: Code): State | void {
    const tail = self.events[self.events.length - 1];
    return tail &&
      tail[1].type === tokenTypes.defListDescriptionIndent &&
      tail[2].sliceSerialize(tail[1], true).length === self.containerState!.size!
      ? ok(code)
      : nok(code);
  }
}

function tokenizeDefListDescriptionPrefixWhitespace(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State,
): State {
  const self = this; // eslint-disable-line @typescript-eslint/no-this-alias
  return factorySpace(
    effects,
    afterPrefix,
    tokenTypes.defListDescriptionPrefixWhitespace,
    self.parser.constructs.disable.null.includes('codeIndented')
      ? undefined
      : constants.tabSize + 1,
  );

  function afterPrefix(code: Code): State | void {
    const tail = self.events[self.events.length - 1];
    console.log('whitespace');

    return !markdownSpace(code) &&
      tail &&
      tail[1].type === tokenTypes.defListDescriptionPrefixWhitespace
      ? ok(code)
      : nok(code);
  }
}

function tokenizeDefListEnd(this: TokenizeContext, effects: Effects): void {
  console.log('container end');
  effects.exit(tokenTypes.defListDescription);
  effects.exit(tokenTypes.defList);
}