import React from 'react';
import { List, ListItemText, ListItemIcon, ListSubheader } from '@mui/material';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import { Typography } from '@mui/material';

import { ListItemLink, ListItemLinkProps } from '../uiparts/listItemLink';
import { useStaticQuery, graphql } from 'gatsby';

type NaviItem = {
  text: string;
  to?: string;
};

type NaviCategory = {
  category: string;
  menu: NaviItem[];
};

type NaviData = NaviCategory[];

const NaviListItem: React.VFC<{ item: NaviItem }> = (props) => {
  const nestedStyle = {
    '@media not all and (pointer: coarse)': { paddingTop: 0.1, paddingBottom: 0.1 },
  } as const;
  let itemProps: ListItemLinkProps;
  if (props.item.to != null) {
    itemProps = { sx: nestedStyle, to: props.item.to };
  } else {
    itemProps = { sx: nestedStyle };
  }

  return (
    <ListItemLink {...itemProps}>
      <ListItemIcon sx={{ color: 'primary.light', minWidth: 0 }}>
        <ArrowRightRoundedIcon />
      </ListItemIcon>
      <ListItemText>
        <Typography noWrap variant="body2">
          {props.item.text}
        </Typography>
      </ListItemText>
    </ListItemLink>
  );
};
NaviListItem.displayName = 'NaviListItem';

const SectionCategoryNavi: React.VFC<NaviCategory> = React.memo((props) => {
  return (
    <React.Fragment>
      <ListSubheader
        component="div"
        disableSticky
        sx={{
          color: 'primary.contrastText',
          backgroundColor: 'primary.main',
          lineHeight: '1em',
          paddingLeft: 3,
          paddingTop: 1.3,
          paddingBottom: 0.7,
          marginBottom: 1,
          ':not(:first-of-type)': {
            marginTop: 2,
          },
        }}
      >
        {props.category}
      </ListSubheader>

      <List>
        {props.menu.map((itemData, j) => (
          <NaviListItem key={j} item={itemData} />
        ))}
      </List>
    </React.Fragment>
  );
});
SectionCategoryNavi.displayName = 'SectionCategoryNavi';

export const SectionNaviList: React.VFC = () => {
  const data = useStaticQuery<GatsbyTypes.SiteSectionMenuQuery>(
    graphql`
      query SiteSectionMenu {
        sectionMenu {
          childrenSectionMenuCategory {
            menu {
              text
              to
            }
            category
          }
        }
      }
    `,
  );
  const naviData: NaviData = (data.sectionMenu?.childrenSectionMenuCategory as NaviData) || [];

  const naviItems = naviData.map((naviCategory, i) => (
    <SectionCategoryNavi key={i} category={naviCategory.category} menu={naviCategory.menu} />
  ));

  return (
    <List role="navigation" aria-label="section navigation">
      {naviItems}
    </List>
  );
};
SectionNaviList.displayName = 'SectionNaviList';
