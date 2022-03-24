import React from 'react';
import { Box, Typography, ButtonGroup } from '@mui/material';
import { IconButton, IconButtonProps, styled, experimental_sx as sx } from '@mui/material';
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material';

import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import { MuiGatsbyLink } from './uiparts/link';

const StyledIconButton = styled((props: IconButtonProps) => <IconButton {...props}></IconButton>)(
  sx({
    borderRadius: 1,
    padding: 0,
    verticalAlign: 'top',
    ':hover': { backgroundColor: 'primary.main', color: 'white', cursor: 'pointer' },
  }),
);

const CustomizedTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
});

const AttachmentItem: React.VFC<{ name: string; to: string }> = (props) => {
  return (
    <Box sx={{ display: 'flex', columnGap: 1 }}>
      <ArrowCircleRightRoundedIcon sx={{ flexShrink: 0 }}></ArrowCircleRightRoundedIcon>
      <Typography
        fontSize="14px"
        sx={{
          flexGrow: 1,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <CustomizedTooltip title={props.name} arrow placement="right-end">
          <MuiGatsbyLink to={props.to}>{props.name}</MuiGatsbyLink>
        </CustomizedTooltip>
      </Typography>

      <ButtonGroup size="small">
        <StyledIconButton>
          <ModeEditOutlinedIcon></ModeEditOutlinedIcon>
        </StyledIconButton>
        <StyledIconButton>
          <FileDownloadOutlinedIcon></FileDownloadOutlinedIcon>
        </StyledIconButton>
        <StyledIconButton>
          <DeleteForeverOutlinedIcon></DeleteForeverOutlinedIcon>
        </StyledIconButton>
      </ButtonGroup>
    </Box>
  );
};

export const Attachments: React.VFC = () => {
  const attachInfos = [
    { name: 'test1.aaaaaaaaaaaaaaaaaaa.py', to: 'test1.py' },
    { name: 'test2.py', to: 'test2.py' },
    { name: 'test3.py', to: 'test3.py' },
  ];
  return (
    <Box padding={3} paddingTop={6}>
      <Typography variant="body1" color="primary.main" fontSize="14px" fontWeight="bold">
        Attachments
      </Typography>

      <Box margin={2}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: (theme) => theme.palette.gray[1],
            border: '3px dashed',
            borderRadius: 2,
            borderColor: (theme) => theme.palette.gray[0],
            padding: 2,
          }}
        >
          <FileUploadOutlinedIcon></FileUploadOutlinedIcon>
          <Typography fontSize="14px">Drag and drop or Click here</Typography>
        </Box>
      </Box>

      <Box marginTop={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {attachInfos.map((e) => (
          <AttachmentItem key={e.name} name={e.name} to={e.to} />
        ))}
      </Box>
    </Box>
  );
};
