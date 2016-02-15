formatAdditionalResultsConfig = {
    //add items that need to be removed comma seperated (regex allowed)
    remove: [
      '//Note:Please hot it for clickthrough',
      '.*Initial load exceeds.*',
      '.*Replay video action is tracking after the .*?start video.*? metric.*',
    ],
    // Add phrases that need to be replaced in this format
    // ["<FIND_STRING (regex allowed)>, "<REPLACE_STRING>"]
    replace: [
    ]
}
