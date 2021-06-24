import React from 'react';
import { Link, GatsbyLinkProps } from 'gatsby';
import MuiLink, { LinkProps } from '@material-ui/core/Link';

interface ALinkProps extends Omit<GatsbyLinkProps<any>, 'to'> {
  href: string;
}

const ALink: React.FC<ALinkProps> = ({
  href,
  children,
  innerRef,
  ...other
}) => (
  <a href={href} ref={innerRef} {...other}>
    {children}
  </a>
);

export const GatsbyLink = React.forwardRef(
  (
    props: Omit<GatsbyLinkProps<unknown>, 'ref'>,
    ref: React.Ref<HTMLAnchorElement>,
  ) => {
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

export const MuiGatsbyLink = React.forwardRef<
  HTMLAnchorElement,
  LinkProps & { to?: string }
>((props, ref) => {
  const { to } = props;
  return to ? (
    <MuiLink ref={ref} component={GatsbyLink} to={to} {...props} />
  ) : (
    <MuiLink ref={ref} {...props} />
  );
});
MuiGatsbyLink.displayName = 'MuiGatsbyLink';