import React from 'react';
import { Box } from '@mui/material';
import { TextField, TextFieldProps } from '@mui/material';
import { inputBaseClasses, inputLabelClasses } from '@mui/material';
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GatsbyLink } from '../../utils/link';
import MuiLink, { LinkProps } from '@mui/material/Link';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

const MuiGatsbyLink = React.forwardRef<HTMLAnchorElement, LinkProps & { to?: string }>(
  (props, ref) => {
    const { to } = props;
    return to ? (
      <MuiLink
        color="secondary"
        ref={ref}
        component={GatsbyLink}
        underline="none"
        to={to}
        sx={{
          display: 'block',
          paddingLeft: 2,
          marginBottom: 1,
          '@media (hover: hover)': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: 0,
          },

          '&:hover': {
            backgroundColor: 'secondary.main',
            color: 'white',
          },
        }}
        {...props}
      />
    ) : (
      <MuiLink color="secondary" ref={ref} underline="hover" {...props} />
    );
  },
);
MuiGatsbyLink.displayName = 'MuiGatsbyLink';

const RoundedTextField = styled((props: TextFieldProps) => <TextField {...props} />)(
  ({ theme }) => ({
    [`& .${inputLabelClasses.root}`]: {
      color: theme.palette.gray[3],
      fontSize: '14px',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    [`& .${inputBaseClasses.root}`]: {
      borderRadius: theme.spacing(3),
      '> input': {
        color: theme.palette.text.primary,
        fontSize: '14px',
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
    },
  }),
);

const CustomizedTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
});

const useFilterPages: (pages: string[], filterInput: string) => Array<React.ReactElement> = (
  pages,
  filterInput,
) => {
  const theme = useTheme();
  const placement = useMediaQuery(theme.breakpoints.down('md')) ? 'bottom-start' : 'right-start';

  if (filterInput.length === 0) {
    return [];
  } else {
    return pages
      .filter((value) => value.match(filterInput))
      .map((e, i) => (
        <CustomizedTooltip key={i} title={e} arrow placement={placement}>
          <MuiGatsbyLink to={`/${e}`}>{e}</MuiGatsbyLink>
        </CustomizedTooltip>
      ));
  }
};

export const FilterBox: React.VFC = (_props) => {
  const [inputValue, setInputValue] = React.useState('');
  const [hiddenResults, setHiddenResults] = React.useState<boolean>(true);

  const dummypages: Array<string> = [];

  const handleChange = React.useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);
      if (value.length === 0) {
        setHiddenResults(true);
      } else {
        setHiddenResults(false);
      }
    },
    [setInputValue, dummypages],
  );
  const candidates = useFilterPages(dummypages, inputValue);

  return (
    <React.Fragment>
      <Box marginX={2} marginY={3}>
        <RoundedTextField
          aria-label="filter"
          label="Filter pages..."
          size="small"
          fullWidth
          sx={{
            fontSize: '12px',
          }}
          inputProps={{ value: inputValue, onChange: handleChange }}
        />
      </Box>
      <Box
        marginY={hiddenResults ? 0 : 3}
        marginRight={1}
        sx={{
          visibility: hiddenResults ? 'hidden' : 'visible',
          height: hiddenResults ? 0 : 100,
          transition: (theme) =>
            theme.transitions.create(['height', 'margin'], {
              duration: theme.transitions.duration.standard,
            }),
        }}
      >
        <OverlayScrollbarsComponent
          options={{
            className: 'os-theme-dark os-theme-custom os-host-flexbox',
            scrollbars: {
              clickScrolling: true,
            },
          }}
        >
          <Box
            fontSize="12px"
            sx={{
              visibility: hiddenResults ? 'hidden' : 'visible',
              height: hiddenResults ? 0 : 100,
              transition: (theme) =>
                theme.transitions.create(['height', 'visibility'], {
                  duration: theme.transitions.duration.standard,
                }),
            }}
          >
            {hiddenResults ? null : candidates.length > 0 ? (
              candidates
            ) : (
              <Box paddingLeft={2}>{'(no matches)'}</Box>
            )}
          </Box>
        </OverlayScrollbarsComponent>
      </Box>
    </React.Fragment>
  );
};
FilterBox.displayName = 'FilterBox';
