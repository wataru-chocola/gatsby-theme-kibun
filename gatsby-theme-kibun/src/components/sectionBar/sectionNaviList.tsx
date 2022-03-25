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

const NaviListItem: React.VFC<{ key: string | number; item: NaviItem }> = (props) => {
  const nestedStyle = {
    '@media not all and (pointer: coarse)': { paddingTop: 0.1, paddingBottom: 0.1 },
  } as const;
  let itemProps: ListItemLinkProps;
  if (props.item.to != null) {
    itemProps = { key: props.key, sx: nestedStyle, to: props.item.to };
  } else {
    itemProps = { key: props.key, sx: nestedStyle };
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

const NaviItemList: React.VFC<{ key: string | number; naviItems: NaviItem[] }> = React.memo(
  (props) => {
    const listItems: React.ReactElement[] = [];
    for (let j = 0; j < props.naviItems.length; j++) {
      const itemData = props.naviItems[j];
      listItems.push(<NaviListItem key={j} item={itemData} />);
    }
    return <List key={props.key}>{listItems}</List>;
  },
);
NaviItemList.displayName = 'NaviItemList';

const SectionNaviListInner: React.VFC<{ naviData: NaviData }> = React.memo((props) => {
  const naviListItems: React.ReactElement[] = [];

  props.naviData.forEach((naviCategory, i) => {
    naviListItems.push(
      <ListSubheader
        key={`header-${i}`}
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
          ':not(:first-child)': {
            marginTop: 2,
          },
        }}
      >
        {naviCategory.category}
      </ListSubheader>,
    );

    naviListItems.push(<NaviItemList key={`list-${i}`} naviItems={naviCategory.menu} />);
  });

  return <List>{naviListItems}</List>;
});
SectionNaviListInner.displayName = 'SectionNaviListInner';

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
  return <SectionNaviListInner naviData={naviData} />;
};
SectionNaviList.displayName = 'SectionNaviList';
