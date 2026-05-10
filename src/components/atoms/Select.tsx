/**
 * @file Select.tsx
 * @description 全画面で利用する共通セレクトコンポーネント
 */
"use client";

import { Paper, Select as MuiSelect } from "@mui/material";
import type { PaperProps, SelectProps as MuiSelectProps } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { alpha, styled } from "@mui/material/styles";

/** 共通SelectのProps */
export type SelectProps = MuiSelectProps;

type AccentColor = NonNullable<MuiSelectProps["color"]>;

/** styled 用: MUI の color に対応するアクセント色 */
type StyledMuiSelectProps = MuiSelectProps & {
  $accentColor: AccentColor;
};

/** MUI Select の color に対応するアクセント色を返す */
const getAccentColor = (theme: Theme, color: AccentColor): string => {
  return theme.palette[color].main;
};

/** ドロップダウンメニューの Paper（$accentColor でグロウ配色を切り替える） */
const StyledMenuPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "$accentColor",
})<PaperProps & { $accentColor: AccentColor }>(({ theme, $accentColor }) => {
  const accent = getAccentColor(theme, $accentColor);
  return {
    borderRadius: "12px",
    marginTop: theme.spacing(0.5),
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    backdropFilter: "blur(12px)",
    border: `1px solid ${alpha(accent, 0.2)}`,
    boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.08)}, 0 0 12px ${alpha(accent, 0.18)}`,
    "& .MuiMenuItem-root": {
      transition: theme.transitions.create(["background-color", "color"], {
        duration: theme.transitions.duration.shortest,
      }),
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: alpha(accent, 0.08),
      color: accent,
    },
    "& .MuiMenuItem-root.Mui-selected": {
      backgroundColor: alpha(accent, 0.14),
      fontWeight: 600,
    },
    "& .MuiMenuItem-root.Mui-selected:hover": {
      backgroundColor: alpha(accent, 0.22),
    },
  };
});

/** 共通セレクトUI（$accentColor で枠・グローの配色を切り替える） */
const StyledMuiSelect = styled(MuiSelect, {
  shouldForwardProp: (prop) => prop !== "$accentColor",
})<StyledMuiSelectProps>(({ theme, $accentColor }) => {
  const accent = getAccentColor(theme, $accentColor);

  return {
    borderRadius: "12px",
    backgroundColor: alpha(theme.palette.background.paper, 0.05),
    backdropFilter: "blur(10px)",
    boxShadow: `0 0 10px ${alpha(accent, 0.2)}`,
    transition: theme.transitions.create(["box-shadow", "border-color", "color", "background-color"], {
      duration: theme.transitions.duration.shorter,
    }),
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.background.paper, 0.2),
      transition: theme.transitions.create(["border-color"], {
        duration: theme.transitions.duration.shorter,
      }),
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 0.08),
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: accent,
    },
    "&:hover .MuiSelect-icon": {
      color: accent,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: accent,
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 4px ${alpha(accent, 0.12)}, 0 0 24px ${alpha(accent, 0.55)}`,
    },
    "&.Mui-focused .MuiSelect-icon": {
      color: accent,
    },
    "& .MuiSelect-select": {
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
    "& .MuiSelect-select[data-value='']": {
      color: alpha(theme.palette.text.secondary, 0.6),
    },
    "& .MuiSelect-icon": {
      color: alpha(theme.palette.text.secondary, 0.7),
      transition: theme.transitions.create(["transform", "color"], {
        duration: theme.transitions.duration.shorter,
      }),
    },
    "& .MuiSelect-iconOpen": {
      transform: "rotate(180deg)",
      color: accent,
    },
    "&.Mui-disabled": {
      backgroundColor: alpha(theme.palette.text.disabled, 0.04),
      boxShadow: "none",
    },
    "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.text.disabled, 0.2),
    },
    "&.Mui-disabled .MuiSelect-icon": {
      color: theme.palette.text.disabled,
    },
  };
});

/**
 * 共通セレクトコンポーネントを表示する
 * @param props 表示に必要なプロパティ
 * @returns 共通セレクトUI
 */
export const Select = (props: SelectProps) => {
  const accentColor = props.color ?? "primary";
  const { MenuProps, ...rest } = props;

  const mergedMenuProps: MuiSelectProps["MenuProps"] = {
    ...MenuProps,
    PaperProps: {
      ...(MenuProps?.PaperProps ?? {}),
      // $accentColor は StyledMenuPaper のトランジェントプロップ
      component: StyledMenuPaper,
      $accentColor: accentColor,
    } as PaperProps,
  };

  return <StyledMuiSelect {...rest} MenuProps={mergedMenuProps} $accentColor={accentColor} />;
};
