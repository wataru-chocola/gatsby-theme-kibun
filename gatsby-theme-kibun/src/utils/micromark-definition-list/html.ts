import { CompileContext } from 'micromark-util-types';
import { tokenTypes } from './types';

export const defListHtml = {
  enter: {
    [tokenTypes.defList](this: CompileContext): void {
      this.lineEndingIfNeeded();
      this.tag('<dl>');
    },
    [tokenTypes.defListTerm](this: CompileContext): void {
      this.lineEndingIfNeeded();
      this.tag('<dt>');
    },
    [tokenTypes.defListDescription](this: CompileContext): void {
      this.lineEndingIfNeeded();
      this.tag('<dd>');
    },
  },
  exit: {
    [tokenTypes.defList](this: CompileContext): void {
      this.lineEndingIfNeeded();
      this.tag('</dl>');
    },
    [tokenTypes.defListTerm](this: CompileContext): void {
      this.tag('</dt>');
    },
    [tokenTypes.defListDescription](this: CompileContext): void {
      this.tag('</dd>');
    },
  },
};
