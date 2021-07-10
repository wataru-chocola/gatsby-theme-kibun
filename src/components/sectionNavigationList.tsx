import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  ListSubheader,
  ListItemProps,
} from '@material-ui/core';
import ArrowRightRoundedIcon from '@material-ui/icons/ArrowRightRounded';
import { Typography } from '@material-ui/core';
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

type NaviDataType = readonly NaviCategoryType[];

export const SectionNavigationList: React.VFC = () => {
  const data = useStaticQuery<GatsbyTypes.SiteSectionMenuQuery>(
    graphql`
      query SiteSectionMenu {
        site {
          siteMetadata {
            description
            siteUrl
            title
            sectionMenu {
              category
              menu {
                text
                to
              }
            }
          }
        }
      }
    `,
  );
  const naviData: NaviDataType = (data.site?.siteMetadata?.sectionMenu as NaviDataType) || [];
  const classes = useStyles();

  const naviListItems: React.ReactElement[] = [];
  naviData.forEach((naviCategory, _i) => {
    naviListItems.push(
      <ListSubheader component="div" disableSticky classes={{ root: classes.subheader }}>
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
    naviListItems.push(<List>{nestedListItems}</List>);
  });

  return <List>{naviListItems}</List>;
};
