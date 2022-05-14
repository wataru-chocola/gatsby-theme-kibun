import React from 'react';
import { Breadcrumbs, BreadcrumbsProps } from '@mui/material';
import { Typography } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { MuiGatsbyLink } from './uiparts/link';

interface PathBreadcrumb {
  path: string;
  title?: string;
}

interface PathBreadcrumbsProps extends BreadcrumbsProps {
  crumbs: Array<PathBreadcrumb>;
}

const PathBreadcrumbs: React.VFC<PathBreadcrumbsProps> = (props) => {
  const theme = useTheme();
  const smallDisplay = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const fontSize = smallDisplay ? '8pt' : '10pt';

  const items = props.crumbs.map((crumb, i) => {
    let slug = crumb.path;
    if (slug.endsWith('/')) {
      slug = slug.slice(0, -1);
    }
    const pathElem = slug.split('/').slice(-1)[0];
    const title: string = crumb.title || pathElem || '';

    return i !== props.crumbs.length - 1 ? (
      <MuiGatsbyLink to={crumb.path} key={i}>
        {title}
      </MuiGatsbyLink>
    ) : (
      <Typography
        key={i}
        sx={{ fontSize: fontSize, color: (theme) => theme.palette.gray[2], lineHeight: 1 }}
      >
        {title}
      </Typography>
    );
  });
  return (
    <Breadcrumbs
      aria-label="path breadcrumb"
      maxItems={smallDisplay ? 1 : 4}
      itemsBeforeCollapse={smallDisplay ? 0 : 1}
      itemsAfterCollapse={smallDisplay ? 1 : 2}
      sx={{
        fontSize: fontSize,
      }}
    >
      {items}
    </Breadcrumbs>
  );
};

export default PathBreadcrumbs;
