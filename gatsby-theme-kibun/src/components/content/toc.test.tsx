import React from 'react';
import { render, screen } from '../../utils/test-utils';

import TableOfContents from './toc';

test('should have an appropriate role and label', () => {
  render(
    <TableOfContents>
      <ul>
        <li>test 1</li>
        <li>test 2</li>
      </ul>
    </TableOfContents>,
  );
  expect(screen.getByRole('navigation', { name: 'table of contents' })).toBeInTheDocument();
});
