import React from 'react';

import { Typography, Box, MenuProps } from '@mui/material';

import Layout, { useLayoutControl } from '../components/layout';
import { HeaderContent } from '../components/header';
import { SectionMenu } from '../components/sectionMenu';
import { Attachments } from '../components/attachments';
import { ActionMenu } from '../components/header/actionMenu';

const NotFoundPage: React.VFC = () => {
  const title = '404: Not Found';
  const layoutControl = useLayoutControl();
  const menuRender = React.useCallback((props: MenuProps) => {
    return <ActionMenu {...props} />;
  }, []);

  return (
    <Layout
      pageTitle={title}
      headerContent={<HeaderContent pageTitle={title} menuRender={menuRender} />}
      sidebarContent={<SectionMenu />}
      rightPanelContent={<Attachments />}
      control={layoutControl}
    >
      <Box my={3}>
        <Typography variant="h1">404: Not Found</Typography>
        <Typography variant="body1">
          You just hit a route that doesn&#39;t exist... the sadness.
        </Typography>
      </Box>
    </Layout>
  );
};

export default NotFoundPage;
