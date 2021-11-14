import React from 'react';
import { Link, GatsbyLinkProps as OriginalGatsbyLinkProps } from 'gatsby';
import MuiLink, { LinkProps } from '@mui/material/Link';

interface ALinkProps extends Omit<OriginalGatsbyLinkProps<any>, 'to'> {
  href: string;
}

const ALink: React.FC<ALinkProps> = ({ href, children, innerRef, ...other }) => (
  <a href={href} ref={innerRef} {...other}>
    {children}
  </a>
);

export const GatsbyLink = React.forwardRef(
  (props: Omit<OriginalGatsbyLinkProps<unknown>, 'ref'>, ref: React.Ref<HTMLAnchorElement>) => {
    const { to, activeClassName, partiallyActive, ...other } = props;
    const internal = /^\/(?!\/)/.test(to);

    // Use Gatsby Link for internal links, and <a> for others
    if (internal) {
      const file = /\.[0-9a-z]+$/i.test(to);

      if (file) {
        return <ALink href={to} innerRef={ref} {...other} />;
      }
      return (
        <Link
          to={to}
          activeClassName={activeClassName}
          partiallyActive={partiallyActive}
          innerRef={ref}
          {...other}
        />
      );
    }
    return <ALink href={to} innerRef={ref} {...other} />;
  },
);
GatsbyLink.displayName = 'GatsbyLink';

export type GatsbyLinkProps = Parameters<typeof GatsbyLink>[0];

export const MuiGatsbyLink = React.forwardRef<HTMLAnchorElement, LinkProps & { to?: string }>(
  (props, ref) => {
    const { to } = props;
    return to ? (
      <MuiLink ref={ref} component={GatsbyLink} underline="hover" to={to} {...props} />
    ) : (
      <MuiLink ref={ref} underline="hover" {...props} />
    );
  },
);
MuiGatsbyLink.displayName = 'MuiGatsbyLink';
