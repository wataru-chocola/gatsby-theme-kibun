import { defList } from './index';
import { fromMarkdown } from 'mdast-util-from-markdown';

const parse = (md: string) => fromMarkdown(md, { extensions: [defList] });

test('simple definition list', () => {
  const result = parse(`
Apple
:   Pomaceous fruit of plants of the genus Malus in 
    the family Rosaceae.

Orange
:   The fruit of an evergreen tree of the genus Citrus.
`);
  expect(result).toEqual({});
});

test('definition with multiple lines without indentation', () => {
  const result = parse(`
Apple
:   Pomaceous fruit of plants of the genus Malus in 
the family Rosaceae.

Orange
:   The fruit of an evergreen tree of the genus Citrus.
`);
  expect(result).toEqual({});
});

test('have one difinition associated with one term', () => {
  const result = parse(`
Apple
:   Pomaceous fruit of plants of the genus Malus in 
    the family Rosaceae.
:   An American computer company.

Orange
:   The fruit of an evergreen tree of the genus Citrus.
`);
  expect(result).toEqual({});
});

test('associate multiple terms to a definition', () => {
  const result = parse(`
Term 1
Term 2
:   Definition a

Term 3
:   Definition b
`);

  expect(result).toEqual({});
});

test('definition preceded by a blank line', () => {
  const result = parse(`
Apple

:   Pomaceous fruit of plants of the genus Malus in 
    the family Rosaceae.

Orange

:    The fruit of an evergreen tree of the genus Citrus.
`);
  expect(result).toEqual({});
});

test('defList could contain multiple paragraph and other block-level elements', () => {
  const result = parse(`
Term 1

:   This is a definition with two paragraphs. Lorem ipsum 
    dolor sit amet, consectetuer adipiscing elit. Aliquam 
    hendrerit mi posuere lectus.

    Vestibulum enim wisi, viverra nec, fringilla in, laoreet
    vitae, risus.

:   Second definition for term 1, also wrapped in a paragraph
    because of the blank line preceding it.

Term 2

:   This definition has a code block, a blockquote and a list.

        code block.

    > block quote
    > on two lines.

    1.  first list item
    2.  second list item
`);
  expect(result).toEqual({});
});
