// @ts-check

function GenerateReportObject(report_given = {}) {
  var report = {
    reporting_frequency: {
      quarterly: {
        time_period: {
          election_year: ['Q1', 'Q2', 'Q3', '12G', '30G', 'YE', 'TER'],
          non_election_year: ['Q1', 'MY', 'Q2', 'YE', 'TER'],
          special: ['12P', '12R', '12C', '12S', '30R', '30S'],
        },
        coverage_from_date: '',
        coverage_through_date: '',
        election_on: '',
        state: '',
      },
      monthly: {
        time_period: {
          election_year: ['M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', '12G', '30G', 'YE', 'TER'],
          non_election_year: ['M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'YE', 'TER'],
        },
        coverage_from_date: '',
        coverage_through_date: '',
        election_on: '',
        state: '',
      },
    },
  };
}
