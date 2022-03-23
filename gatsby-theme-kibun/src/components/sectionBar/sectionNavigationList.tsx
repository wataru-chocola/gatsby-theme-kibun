import React from 'react';
import {
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  ListSubheader,
  ListItemProps,
} from '@mui/material';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import { Typography } from '@mui/material';
import { GatsbyLink, GatsbyLinkProps } from '../../utils/link';
import { useStaticQuery, graphql } from 'gatsby';

type ListItemLinkProps = Omit<ListItemProps<'a', GatsbyLinkProps & { button?: true }>, 'component'>;
function ListItemLink(props: ListItemLinkProps) {
  return <ListItem button component={GatsbyLink} {...props} />;
}

type NaviItemType = {
  text: string;
  to?: string;
};

type NaviCategoryType = {
  category: string;
  menu: NaviItemType[];
};

type NaviDataType = NaviCategoryType[];

function makeNaviMenu(naviMenuItems: NaviItemType[]): React.ReactElement[] {
  const nestedListItems: React.ReactElement[] = [];
  for (let j = 0; j < naviMenuItems.length; j++) {
    const nestedItemData = naviMenuItems[j];
    const linkText = (
      <React.Fragment>
        <ListItemIcon sx={{ color: 'primary.light', minWidth: 0 }}>
          <ArrowRightRoundedIcon />
        </ListItemIcon>
        <ListItemText>
          <Typography noWrap variant="body2">
            {nestedItemData.text}
          </Typography>
        </ListItemText>
      </React.Fragment>
    );

    const nestedStyle = { paddingTop: { md: 0 }, paddingBottom: { md: 0 } } as const;
    if (nestedItemData.to != null) {
      nestedListItems.push(
        <ListItemLink button key={j} to={nestedItemData.to} sx={nestedStyle}>
          {linkText}
        </ListItemLink>,
      );
    } else {
      nestedListItems.push(
        <ListItem button key={j} sx={nestedStyle}>
          {linkText}
        </ListItem>,
      );
    }
  }
  return nestedListItems;
}

export const SectionNavigationList: React.VFC = () => {
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
  const naviData: NaviDataType =
    (data.sectionMenu?.childrenSectionMenuCategory as NaviDataType) || [];

  const naviListItems: React.ReactElement[] = [];
  naviData.forEach((naviCategory, i) => {
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
          paddingTop: 1,
          paddingBottom: 1,
          marginBottom: 1,
          ':not(::first-child)': {
            marginTop: 2,
          },
        }}
      >
        {naviCategory.category}
      </ListSubheader>,
    );

    const nestedListItems = makeNaviMenu(naviCategory.menu);
    naviListItems.push(<List key={`list-${i}`}>{nestedListItems}</List>);
  });

  return <List>{naviListItems}</List>;
};
