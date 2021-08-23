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
import { subtokenize } from 'micromark-util-subtokenize';
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
  tokenize: tokenizaDefListStart,
  continuation: {
    tokenize: tokenizeDefListContinuation,
  },
  resolveTo: resolveToDefinitionTerm,
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
    console.log({
      event: x[0],
      token: x[1].type,
      content: content,
    });
  });
}

function resolveToDefinitionTerm(events: Event[], context: TokenizeContext): Event[] {
  console.log('xxxxx');
  let index = events.length;
  let defList_start: number | undefined;
  while (index--) {
    if (events[index][0] === 'enter' && events[index][1].type === tokenTypes.defList) {
      defList_start = index;
      break;
    }
  }
  assert(defList_start !== undefined, 'expected a start of defList found');

  const tail = events[defList_start - 1];
  if (tail[1].type === types.chunkFlow) {
    console.log('flow events');
    inspectEvents(tail[1]._tokenizer?.events);
  }
  console.log('document events');
  inspectEvents(events);
  return context.events;
}

function tokenizaDefListStart(
  this: TokenizeContextWithDefState,
  effects: Effects,
  ok: State,
  nok: State,
): State {
  const self = this; // eslint-disable-line @typescript-eslint/no-this-alias
  if (self.containerState == null) {
    self.containerState = {};
  }

  const tail = self.events[self.events.length - 1];
  let initialSize =
    tail && tail[1].type === types.linePrefix ? tail[2].sliceSerialize(tail[1], true).length : 0;
  return start;

  function start(code: Code): State | void {
    console.log('start: start' + String(code));
    if (code !== codes.colon) {
      return nok(code);
    }

    if (self.parser.lazy[self.now().line]) {
      // in the middle of blockquote or something
      return nok(code);
    }

    if (self.containerState!.type == null) {
      // start defList only when definition term found.
      if (self.interrupt) {
        effects.enter(tokenTypes.defList, { _container: true });
        self.containerState!.type = tokenTypes.defList;
      } else {
        return nok(code);
      }
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
