import React from 'react';
import { Breadcrumbs, BreadcrumbsProps } from '@mui/material';
import { Typography } from '@mui/material';
import { MuiGatsbyLink } from '../utils/link';

interface PathBreadcrumb {
  path: string;
  title?: string;
}

interface PathBreadcrumbsProps extends BreadcrumbsProps {
  crumbs: Array<PathBreadcrumb>;
}

const PathBreadcrumbs: React.VFC<PathBreadcrumbsProps> = (props) => {
  const items = props.crumbs.map((crumb, i) => {
    let slug = crumb.path;
    if (slug.endsWith('/')) {
      slug = slug.slice(0, -1);
    }
    const pathElem = slug.split('/').slice(-1)[0];
    const title: string = crumb.title || pathElem || '';

    return i !== props.crumbs.length - 1 ? (
      <MuiGatsbyLink to={crumb.path} key={i} style={{ fontSize: 'sm' }}>
        {title}
      </MuiGatsbyLink>
    ) : (
      <Typography color="textPrimary" key={i} style={{ fontSize: 'sm' }}>
        {title}
      </Typography>
    );
  });
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      maxItems={4}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
      sx={{ fontSize: '12px' }}
    >
      {items}
    </Breadcrumbs>
  );
};

export default PathBreadcrumbs;
