export const CATEGORIES = {
  Actions: ['SButton', 'SButtonGroup', 'SIconButton', 'SFab', 'SToggleButton', 'SCopyButton', 'SLink'],
  'Form controls': [
    'SFormField', 'SLabel', 'SInput', 'SPasswordInput', 'SNumberInput', 'STextarea', 'SSearchInput',
    'SAutocomplete', 'SSelect', 'SCheckbox', 'SCheckboxGroup', 'SRadio', 'SRadioGroup', 'SSwitch',
    'SSlider', 'SRangeSlider', 'SToggleGroup', 'SDatePicker', 'STimePicker', 'SColorPicker',
    'SColorSwatches', 'SFileUpload', 'SPinInput', 'STagInput', 'SRating'
  ],
  'Layout & surfaces': [
    'SContainer', 'SGrid', 'SSpacer', 'SDivider', 'SSplitPane', 'SCard', 'SCollapse', 'SAccordion'
  ],
  'Cards & media': [
    'SMediaCard', 'SProfileCard', 'SPricingCard', 'SFlipCard', 'SRibbon', 'SCompare', 'SImage',
    'SAvatar', 'SAvatarGroup', 'SCarousel'
  ],
  Navigation: [
    'SNavbar', 'SSidebar', 'SBottomNav', 'SBreadcrumb', 'STabs', 'SPagination', 'SSteps',
    'SVerticalSteps', 'SMenu', 'STreeView', 'SBackToTop'
  ],
  Overlays: [
    'SModal', 'SDrawer', 'SBottomSheet', 'SConfirmDialog', 'SCommandPalette', 'SLightbox', 'SBackdrop',
    'SPopover', 'SPopConfirm', 'STooltip', 'SContextMenu'
  ],
  'Feedback & status': [
    'SAlert', 'SBanner', 'SToast', 'SSnackbar', 'SProgress', 'SMeter', 'SSpinner', 'SLoadingDots',
    'SLoadingBar', 'SLoadingOverlay', 'SSkeleton', 'SEmpty', 'SResult', 'SStatusDot', 'SBadge',
    'SNotificationBadge', 'SChip', 'STag'
  ],
  'Data display': [
    'STable', 'SList', 'SListItem', 'SDescriptionList', 'STimeline', 'SCalendar', 'SStat', 'SCounter',
    'SCountdown', 'SJsonViewer'
  ],
  Charts: [
    'SBarChart', 'SLineChart', 'SDonutChart', 'SSparkline', 'SGauge', 'SRadialProgress', 'SHeatmap',
    'SStackedBar', 'SKpiCard', 'SScatterPlot', 'SHorizontalBar', 'SRadarChart'
  ],
  'Typography & misc': [
    'SHeading', 'SText', 'SBlockquote', 'SCode', 'SKbd', 'SGradientText', 'STypewriter', 'SMarquee'
  ]
}

export function categoryOf(name) {
  for (const [category, names] of Object.entries(CATEGORIES)) {
    if (names.includes(name)) return category
  }
  return 'Uncategorized'
}
