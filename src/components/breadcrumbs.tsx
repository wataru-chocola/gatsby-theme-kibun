import React from "react";
import { Breadcrumbs, BreadcrumbsProps } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Link } from "gatsby-theme-material-ui";

interface PathBreadcrumb {
  title: string;
  path: string;
}

interface PathBreadcrumbsProps extends BreadcrumbsProps {
  crumbs: Array<PathBreadcrumb>;
}

const PathBreadcrumbs: React.FC<PathBreadcrumbsProps> = (props) => {
  const items = props.crumbs.map((crum, i) =>
    i != props.crumbs.length - 1 ?
      <Link color="inherit" to={crum.path} key={i}>{crum.title}</Link> :
      <Typography color="textPrimary" key={i}>{crum.title}</Typography>
  );
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items}
    </Breadcrumbs>
  );
};

export default PathBreadcrumbs;