import React from 'react';
import { Breadcrumbs, BreadcrumbsProps } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { MuiGatsbyLink } from '../utils/link';

interface PathBreadcrumb {
  title: string;
  path: string;
}

interface PathBreadcrumbsProps extends BreadcrumbsProps {
  crumbs: Array<PathBreadcrumb>;
}

const PathBreadcrumbs: React.VFC<PathBreadcrumbsProps> = (props) => {
  const items = props.crumbs.map((crum, i) =>
    i !== props.crumbs.length - 1 ? (
      <MuiGatsbyLink color="inherit" to={crum.path} key={i} style={{ fontSize: 13 }}>
        {crum.title}
      </MuiGatsbyLink>
    ) : (
      <Typography color="textPrimary" key={i} style={{ fontSize: 13 }}>
        {crum.title}
      </Typography>
    ),
  );
  return <Breadcrumbs aria-label="breadcrumb">{items}</Breadcrumbs>;
};

export default PathBreadcrumbs;
