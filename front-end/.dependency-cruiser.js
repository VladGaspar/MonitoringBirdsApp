/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // Your rules can remain as is, depending on what you want to enforce
  ],
  options: {
    doNotFollow: {
      path: ['node_modules']
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      mainFields: ["main", "types", "typings"],
    },
    reporterOptions: {
      dot: {
        // Adjust the collapse pattern to include only top-level folders within src
        collapsePattern: 'src/(.*)/.*'
      },
      archi: {
        // Similarly adjust the collapse pattern for the archi reporter
        collapsePattern: 'src/(.*)/.*'
      },
      "text": {
        "highlightFocused": true
      },
    }
  }
};
