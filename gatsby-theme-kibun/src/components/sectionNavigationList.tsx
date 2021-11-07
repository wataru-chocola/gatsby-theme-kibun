import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
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
import { GatsbyLink, GatsbyLinkProps } from '../utils/link';
import { useStaticQuery, graphql } from 'gatsby';

function ListItemLink(
  props: Omit<ListItemProps<'a', GatsbyLinkProps & { button?: true }>, 'component'>,
) {
  return <ListItem button component={GatsbyLink} {...props} />;
}

const useStyles = makeStyles((theme) => ({
  subheader: {
    color: theme.palette.secondary.main,
    lineHeight: '1em',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  icon: {
    color: theme.palette.secondary.light,
    minWidth: 0,
  },
  nested: {
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(0),
      paddingBottom: theme.spacing(0),
    },
  },
}));

type NaviItemType = {
  text: string;
  to?: string;
};

type NaviCategoryType = {
  category: string;
  menu: NaviItemType[];
};

type NaviDataType = NaviCategoryType[];

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
  const classes = useStyles();

  const naviListItems: React.ReactElement[] = [];
  naviData.forEach((naviCategory, i) => {
    naviListItems.push(
      <ListSubheader
        key={`header-${i}`}
        component="div"
        disableSticky
        classes={{ root: classes.subheader }}
      >
        {naviCategory.category}
      </ListSubheader>,
    );

    const nestedListItems: React.ReactElement[] = [];
    naviCategory.menu.forEach((nestedItemData, j) => {
      const linkText = (
        <React.Fragment>
          <ListItemIcon className={classes.icon}>
            <ArrowRightRoundedIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography noWrap variant="body2">
              {nestedItemData.text}
            </Typography>
          </ListItemText>
        </React.Fragment>
      );
      if (nestedItemData.to != null) {
        nestedListItems.push(
          <ListItemLink button key={j} to={nestedItemData.to} className={classes.nested}>
            {linkText}
          </ListItemLink>,
        );
      } else {
        nestedListItems.push(
          <ListItem button key={j} className={classes.nested}>
            {linkText}
          </ListItem>,
        );
      }
    });
    naviListItems.push(<List key={`list-${i}`}>{nestedListItems}</List>);
  });

  return <List>{naviListItems}</List>;
};
