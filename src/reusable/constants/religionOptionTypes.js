const religionOptionTypes = [
  { label: 'Aglipay', value: 'Aglipay' },
  {
    label: 'Alliance of Bible Christian Communities of the Philippines',
    value: 'Alliance of Bible Christian Communities of the Philippines',
  },
  { label: 'Assemblies of God', value: 'Assemblies of God' },
  {
    label: 'Association of Baptist Churches in Luzon, Visayas, and Mindanao',
    value: 'Association of Baptist Churches in Luzon, Visayas, and Mindanao',
  },
  {
    label: 'Association of Fundamental Baptist Churches in the Philippines',
    value: 'Association of Fundamental Baptist Churches in the Philippines',
  },
  {
    label: 'Baptist Conference of the Philippines',
    value: 'Baptist Conference of the Philippines',
  },
  { label: 'Bible Baptist Church', value: 'Bible Baptist Church' },
  { label: 'Bread of Life Ministries', value: 'Bread of Life Ministries' },
  { label: 'Buddhist', value: 'Buddhist' },
  {
    label: 'Cathedral of Praise, Incorporated',
    value: 'Cathedral of Praise, Incorporated',
  },
  {
    label: 'Charismatic Full Gospel Ministries',
    value: 'Charismatic Full Gospel Ministries',
  },
  {
    label: 'Christ the Living Stone Fellowship',
    value: 'Christ the Living Stone Fellowship',
  },
  {
    label: 'Christian and Missionary Alliance Church of the Philippines',
    value: 'Christian and Missionary Alliance Church of the Philippines',
  },
  {
    label: 'Christian Missions in the Philippines',
    value: 'Christian Missions in the Philippines',
  },
  { label: 'Church of Christ', value: 'Church of Christ' },
  {
    label: 'Church of God World Mission in the Philippines',
    value: 'Church of God World Mission in the Philippines',
  },
  {
    label: 'Church of Jesus Christ of the Latter Day Saints',
    value: 'Church of Jesus Christ of the Latter Day Saints',
  },
  { label: 'Church of the Nazarene', value: 'Church of the Nazarene' },
  {
    label: 'Christian Reformed Church in the Philippines, Incorporated',
    value: 'Christian Reformed Church in the Philippines, Incorporated',
  },
  {
    label: 'Conservative of the Philippine Baptist Church',
    value: 'Conservative of the Philippine Baptist Church',
  },
  {
    label: 'Convention of the Philippine Baptist Church',
    value: 'Convention of the Philippine Baptist Church',
  },
  {
    label: 'Crusaders of the Divine Church of Christ, Incorporated',
    value: 'Crusaders of the Divine Church of Christ, Incorporated',
  },
  { label: 'Door of Faith', value: 'Door of Faith' },
  {
    label: 'Evangelical Christian Outreach Foundation',
    value: 'Evangelical Christian Outreach Foundation',
  },
  {
    label: 'Evangelical Free Church of the Philippines',
    value: 'Evangelical Free Church of the Philippines',
  },
  {
    label: 'Evangelical Presbyterian Church',
    value: 'Evangelical Presbyterian Church',
  },
  {
    label: 'Faith Tabernacle Church (Living Rock Ministries)',
    value: 'Faith Tabernacle Church (Living Rock Ministries)',
  },
  {
    label: 'Filipino Assemblies of the First Born, Incorporated',
    value: 'Filipino Assemblies of the First Born, Incorporated',
  },
  {
    label: 'Foursquare Gospel Church in the Philippines',
    value: 'Foursquare Gospel Church in the Philippines',
  },
  {
    label: 'Free Believers in Christ Fellowship',
    value: 'Free Believers in Christ Fellowship',
  },
  { label: 'Free Methodist Church', value: 'Free Methodist Church' },
  {
    label: 'Free Mission in the Philippines, Incorporated',
    value: 'Free Mission in the Philippines, Incorporated',
  },
  {
    label: 'General Baptist Churches of the Philippines',
    value: 'General Baptist Churches of the Philippines',
  },
  {
    label: 'Good News Christian Churches',
    value: 'Good News Christian Churches',
  },
  {
    label: 'Higher Ground Baptist Mission',
    value: 'Higher Ground Baptist Mission',
  },
  { label: 'IEMELIF Reform Movement', value: 'IEMELIF Reform Movement' },
  {
    label: 'Iglesia Evangelica Unida de Cristo',
    value: 'Iglesia Evangelica Unida de Cristo',
  },
  {
    label: 'Iglesia Evangelista Methodista en Las Islas Filipinas (IEMELIF)',
    value: 'Iglesia Evangelista Methodista en Las Islas Filipinas (IEMELIF)',
  },
  {
    label: 'Iglesia Filipina Independiente',
    value: 'Iglesia Filipina Independiente',
  },
  { label: 'Iglesia ni Cristo', value: 'Iglesia ni Cristo' },
  {
    label: 'Iglesia sa Dios Espiritu Santo, Incorporated',
    value: 'Iglesia sa Dios Espiritu Santo, Incorporated',
  },
  {
    label: 'Independent Baptist Churches of the Philippines',
    value: 'Independent Baptist Churches of the Philippines',
  },
  {
    label: 'Independent Baptist Missionary Fellowship',
    value: 'Independent Baptist Missionary Fellowship',
  },
  {
    label: 'International One Way Outreach',
    value: 'International One Way Outreach',
  },
  { label: 'Islam', value: 'Islam' },
  { label: "Jehovah's Witness", value: "Jehovah's Witness" },
  {
    label: 'Jesus Christ Saves Global Outreach',
    value: 'Jesus Christ Saves Global Outreach',
  },
  {
    label: 'Jesus is Alive Community, Incorporated',
    value: 'Jesus is Alive Community, Incorporated',
  },
  { label: 'Jesus is Lord Church', value: 'Jesus is Lord Church' },
  { label: 'Jesus Reigns Ministries', value: 'Jesus Reigns Ministries' },
  {
    label: 'Love of Christ International Ministries',
    value: 'Love of Christ International Ministries',
  },
  {
    label: 'Lutheran Church of the Philippines',
    value: 'Lutheran Church of the Philippines',
  },
  {
    label: 'Miracle Life Fellowship International',
    value: 'Miracle Life Fellowship International',
  },
  {
    label: 'Miracle Revival Church of the Philippines',
    value: 'Miracle Revival Church of the Philippines',
  },
  {
    label: 'Missionary Baptist Churches of the Philippines',
    value: 'Missionary Baptist Churches of the Philippines',
  },
  {
    label: 'Pentecostal Church of God Asia Mission',
    value: 'Pentecostal Church of God Asia Mission',
  },
  {
    label: 'Philippine Benevolent Missionaries Association',
    value: 'Philippine Benevolent Missionaries Association',
  },
  {
    label: 'Philippine Ecumenical Christian Church',
    value: 'Philippine Ecumenical Christian Church',
  },
  {
    label: 'Philippine Episcopal Churche',
    value: 'Philippine Episcopal Churche',
  },
  {
    label: 'Philippine Evangelical Mission',
    value: 'Philippine Evangelical Mission',
  },
  {
    label: 'Philippine General Council of the Assemblies of God',
    value: 'Philippine General Council of the Assemblies of God',
  },
  {
    label: 'Philippine Good News Ministries',
    value: 'Philippine Good News Ministries',
  },
  { label: 'Philippine Grace Gospel', value: 'Philippine Grace Gospel' },
  {
    label: 'Philippine Independent Catholic Church',
    value: 'Philippine Independent Catholic Church',
  },
  {
    label: 'Philippine Missionary Fellowship',
    value: 'Philippine Missionary Fellowship',
  },
  {
    label: 'Philippine Pentecostal Holiness Church',
    value: 'Philippine Pentecostal Holiness Church',
  },
  {
    label: "Potter's House Christian Center",
    value: "Potter's House Christian Center",
  },
  {
    label: 'Presbyterian Church in the Philippines',
    value: 'Presbyterian Church in the Philippines',
  },
  {
    label: 'Roman Catholic',
    value: 'Roman Catholic',
  },
  {
    label: 'Salvation Army, Philippines',
    value: 'Salvation Army, Philippines',
  },
  { label: 'Seventh Day Adventist', value: 'Seventh Day Adventist' },
  { label: 'Southern Baptist Church', value: 'Southern Baptist Church' },
  {
    label: 'Take the Nation for Jesus Global Ministries (Corpus Christi)',
    value: 'Take the Nation for Jesus Global Ministries (Corpus Christi)',
  },
  { label: 'Things to Come', value: 'Things to Come' },
  { label: 'UNIDA Evangelical Church', value: 'UNIDA Evangelical Church' },
  {
    label: 'United Church of Christ in the Philippines',
    value: 'United Church of Christ in the Philippines',
  },
  {
    label: 'United Evangelical Church of the Philippines (Chinese)',
    value: 'United Evangelical Church of the Philippines (Chinese)',
  },
  {
    label: 'Union Espiritista Cristiana de Filipinas, Incorporated',
    value: 'Union Espiritista Cristiana de Filipinas, Incorporated',
  },
  { label: 'United Methodists Church', value: 'United Methodists Church' },
  {
    label: 'United Pentecostal Church (Philippines), Incorporated',
    value: 'United Pentecostal Church (Philippines), Incorporated',
  },
  {
    label: 'Universal Pentecostal Church',
    value: 'Universal Pentecostal Church',
  },
  {
    label: 'Victory Chapel Christian Fellowship',
    value: 'Victory Chapel Christian Fellowship',
  },
  {
    label:
      "Watch Tower Bible and Tract Society of the Philippines, Incorporated (Jehovah's Witnesses)",
    value:
      "Watch Tower Bible and Tract Society of the Philippines, Incorporated (Jehovah's Witnesses)",
  },
  { label: 'Way of Salvation', value: 'Way of Salvation' },
  {
    label: 'Way of Salvation Church Incorporated, The',
    value: 'Way of Salvation Church Incorporated, The',
  },
  { label: 'Wesleyan Church, The', value: 'Wesleyan Church, The' },
  { label: 'Word for the World', value: 'Word for the World' },
  {
    label: 'Word International Ministries, Incorporated',
    value: 'Word International Ministries, Incorporated',
  },
  {
    label: 'World Missionary Evangelism',
    value: 'World Missionary Evangelism',
  },
  { label: 'Worldwide Church of God', value: 'Worldwide Church of God' },
  {
    label: 'Zion Christian Community Church',
    value: 'Zion Christian Community Church',
  },
  { label: 'Other Baptists', value: 'Other Baptists' },
  { label: 'Other Evangelical Churches', value: 'Other Evangelical Churches' },
  { label: 'Other Methodists', value: 'Other Methodists' },
  { label: 'Other Protestants', value: 'Other Protestants' },
  { label: 'Tribal religions', value: 'Tribal religions' },
];

export default religionOptionTypes
