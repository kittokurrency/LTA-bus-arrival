import { BusStop, BusServiceArrival, BusRouteInfo, LiveBusTelemetry, BusOperator, LoadLevel, BusDeckType } from '../types/bus';

// Curated list of high-traffic Singapore bus stops
export const SINGAPORE_BUS_STOPS: BusStop[] = [
  {
    BusStopCode: '01012',
    RoadName: 'Victoria St',
    Description: 'Hotel Grand Pacific',
    Latitude: 1.2968,
    Longitude: 103.8528,
    mrtLines: ['DT', 'EW'],
    hubRegion: 'Central',
  },
  {
    BusStopCode: '01112',
    RoadName: 'Victoria St',
    Description: 'Opp Bugis Stn Exit C',
    Latitude: 1.3008,
    Longitude: 103.8561,
    mrtLines: ['DT', 'EW'],
    hubRegion: 'Central',
  },
  {
    BusStopCode: '03211',
    RoadName: 'Orchard Rd',
    Description: 'Somerset Stn',
    Latitude: 1.3005,
    Longitude: 103.8390,
    mrtLines: ['NS'],
    hubRegion: 'Central',
  },
  {
    BusStopCode: '09048',
    RoadName: 'Orchard Rd',
    Description: 'Orchard Stn / Lucky Plaza',
    Latitude: 1.3044,
    Longitude: 103.8335,
    mrtLines: ['NS', 'TE'],
    hubRegion: 'Central',
  },
  {
    BusStopCode: '08057',
    RoadName: 'Orchard Rd',
    Description: 'Dhoby Ghaut Stn',
    Latitude: 1.2991,
    Longitude: 103.8458,
    mrtLines: ['NS', 'NE', 'CC'],
    hubRegion: 'Central',
  },
  {
    BusStopCode: '04111',
    RoadName: 'North Bridge Rd',
    Description: 'Opp The Treasury',
    Latitude: 1.2911,
    Longitude: 103.8502,
    mrtLines: ['EW', 'NS'],
    hubRegion: 'Central',
  },
  {
    BusStopCode: '03539',
    RoadName: 'Bayfront Ave',
    Description: 'Marina Bay Sands MICE',
    Latitude: 1.2838,
    Longitude: 103.8591,
    mrtLines: ['DT', 'CC'],
    hubRegion: 'Central',
  },
  {
    BusStopCode: '03019',
    RoadName: 'Bras Basah Rd',
    Description: 'NTUC Income Ctr',
    Latitude: 1.2974,
    Longitude: 103.8512,
    mrtLines: ['CC', 'DT'],
    hubRegion: 'Central',
  },
  {
    BusStopCode: '84009',
    RoadName: 'Bedok Nth Dr',
    Description: 'Bedok Temp Int',
    Latitude: 1.3240,
    Longitude: 103.9300,
    mrtLines: ['EW'],
    hubRegion: 'East',
  },
  {
    BusStopCode: '75009',
    RoadName: 'Tampines Ave 4',
    Description: 'Tampines Int',
    Latitude: 1.3533,
    Longitude: 103.9452,
    mrtLines: ['EW', 'DT'],
    hubRegion: 'East',
  },
  {
    BusStopCode: '95109',
    RoadName: 'PTB2 Basement',
    Description: 'Changi Airport PTB2',
    Latitude: 1.3551,
    Longitude: 103.9893,
    mrtLines: ['CG'],
    hubRegion: 'East',
  },
  {
    BusStopCode: '82061',
    RoadName: 'Marine Parade Rd',
    Description: 'Marine Parade Stn Exit 2',
    Latitude: 1.3031,
    Longitude: 103.9062,
    mrtLines: ['TE'],
    hubRegion: 'East',
  },
  {
    BusStopCode: '83139',
    RoadName: 'Amber Rd',
    Description: 'Opp Amber Gdns',
    Latitude: 1.3001,
    Longitude: 103.8997,
    mrtLines: ['TE'],
    hubRegion: 'East',
  },
  {
    BusStopCode: '17009',
    RoadName: 'Jurong Gateway Rd',
    Description: 'Jurong East Int',
    Latitude: 1.3332,
    Longitude: 103.7423,
    mrtLines: ['NS', 'EW'],
    hubRegion: 'West',
  },
  {
    BusStopCode: '17179',
    RoadName: 'Commonwealth Ave West',
    Description: 'Clementi Stn Exit B',
    Latitude: 1.3152,
    Longitude: 103.7652,
    mrtLines: ['EW'],
    hubRegion: 'West',
  },
  {
    BusStopCode: '14141',
    RoadName: 'Telok Blangah Rd',
    Description: 'HarbourFront Stn / Vivocity',
    Latitude: 1.2653,
    Longitude: 103.8219,
    mrtLines: ['NE', 'CC'],
    hubRegion: 'West',
  },
  {
    BusStopCode: '19059',
    RoadName: 'Jurong West St 64',
    Description: 'Boon Lay Int',
    Latitude: 1.3394,
    Longitude: 103.7058,
    mrtLines: ['EW'],
    hubRegion: 'West',
  },
  {
    BusStopCode: '46009',
    RoadName: 'Woodlands Sq',
    Description: 'Woodlands Int',
    Latitude: 1.4369,
    Longitude: 103.7865,
    mrtLines: ['NS', 'TE'],
    hubRegion: 'North',
  },
  {
    BusStopCode: '59009',
    RoadName: 'Yishun Ave 2',
    Description: 'Yishun Int',
    Latitude: 1.4294,
    Longitude: 103.8350,
    mrtLines: ['NS'],
    hubRegion: 'North',
  },
  {
    BusStopCode: '53009',
    RoadName: 'Bishan St 13',
    Description: 'Bishan Int',
    Latitude: 1.3508,
    Longitude: 103.8488,
    mrtLines: ['NS', 'CC'],
    hubRegion: 'North',
  },
  {
    BusStopCode: '52009',
    RoadName: 'Lor 6 Toa Payoh',
    Description: 'Toa Payoh Int',
    Latitude: 1.3328,
    Longitude: 103.8475,
    mrtLines: ['NS'],
    hubRegion: 'North',
  },
  {
    BusStopCode: '65009',
    RoadName: 'Punggol Central',
    Description: 'Punggol Temp Int',
    Latitude: 1.4038,
    Longitude: 103.9022,
    mrtLines: ['NE', 'CP'],
    hubRegion: 'North-East',
  },
];

// Mapping of bus services available at each bus stop code
export const STOP_SERVICES_MAP: Record<string, string[]> = {
  '01012': ['14', '36', '124', '147', '166', '174', '190', '857'],
  '01112': ['7', '12', '63', '80', '145', '175', '197', '851'],
  '03211': ['14', '16', '65', '106', '111', '123', '143', '175', '502'],
  '09048': ['7', '14', '16', '36', '65', '124', '143', '174', '190', '518'],
  '08057': ['16', '36', '65', '124', '166', '174', '190', '857'],
  '04111': ['51', '61', '63', '80', '124', '145', '166', '174', '197'],
  '03539': ['97', '106', '133', '502', '518'],
  '03019': ['7', '14', '16', '36', '77', '106', '111', '167', '171', '857'],
  '84009': ['7', '14', '16', '18', '25', '26', '30', '35', '60', '87', '168'],
  '75009': ['10', '19', '22', '27', '29', '31', '38', '65', '72', '81', '291'],
  '95109': ['24', '27', '34', '36', '53', '110', '858'],
  '82061': ['16', '31', '36', '43', '47', '48', '134', '135', '196', '197'],
  '83139': ['31', '36', '43', '48', '196', '197'],
  '17009': ['51', '78', '79', '97', '143', '197', '198', '333', '334', '335'],
  '17179': ['14', '52', '96', '99', '105', '106', '147', '165', '166', '196'],
  '14141': ['10', '30', '57', '61', '65', '80', '97', '100', '131', '143', '145', '166'],
  '19059': ['79', '154', '157', '174', '179', '180', '181', '182', '192', '193'],
  '46009': ['161', '168', '169', '178', '187', '856', '900', '901', '903', '911', '960', '962'],
  '59009': ['39', '85', '171', '800', '804', '806', '851', '852', '853', '854', '857', '859'],
  '53009': ['50', '52', '53', '54', '55', '56', '58', '59', '410G', '410W'],
  '52009': ['8', '26', '28', '31', '73', '88', '90', '139', '141', '142', '143', '145', '157', '159'],
  '65009': ['3', '34', '43', '62', '82', '83', '84', '85', '117', '118', '136', '381', '382G'],
};

// Realistic bus route definitions for key cross-island lines
export const BUS_ROUTES: Record<string, BusRouteInfo> = {
  '190': {
    ServiceNo: '190',
    Operator: 'SMRT',
    Direction: 1,
    OriginCode: '44009',
    OriginName: 'Choa Chu Kang Int',
    DestinationCode: '10541',
    DestinationName: 'Kampong Bahru Ter',
    FirstBusWeekday: '05:30',
    LastBusWeekday: '23:30',
    FrequencyPeakMin: 5,
    FrequencyOffPeakMin: 9,
    Stops: [
      { StopSequence: 1, BusStopCode: '44009', RoadName: 'Choa Chu Kang Loop', Description: 'Choa Chu Kang Int', DistanceKm: 0.0, Latitude: 1.3853, Longitude: 103.7444 },
      { StopSequence: 2, BusStopCode: '44539', RoadName: 'Choa Chu Kang Dr', Description: 'Opp Northvale Condo', DistanceKm: 0.8, Latitude: 1.3835, Longitude: 103.7460 },
      { StopSequence: 3, BusStopCode: '44269', RoadName: 'Teck Whye Ave', Description: 'Bet Blks 13/14', DistanceKm: 2.1, Latitude: 1.3789, Longitude: 103.7535 },
      { StopSequence: 4, BusStopCode: '43419', RoadName: 'Bt Panjang Rd', Description: 'Blk 223', DistanceKm: 4.5, Latitude: 1.3762, Longitude: 103.7712 },
      { StopSequence: 5, BusStopCode: '42089', RoadName: 'Whitley Rd', Description: 'Raffles Town Club', DistanceKm: 11.2, Latitude: 1.3195, Longitude: 103.8290 },
      { StopSequence: 6, BusStopCode: '09048', RoadName: 'Orchard Rd', Description: 'Orchard Stn / Lucky Plaza', DistanceKm: 13.8, Latitude: 1.3044, Longitude: 103.8335 },
      { StopSequence: 7, BusStopCode: '03211', RoadName: 'Orchard Rd', Description: 'Somerset Stn', DistanceKm: 14.5, Latitude: 1.3005, Longitude: 103.8390 },
      { StopSequence: 8, BusStopCode: '08057', RoadName: 'Orchard Rd', Description: 'Dhoby Ghaut Stn', DistanceKm: 15.3, Latitude: 1.2991, Longitude: 103.8458 },
      { StopSequence: 9, BusStopCode: '01012', RoadName: 'Victoria St', Description: 'Hotel Grand Pacific', DistanceKm: 16.1, Latitude: 1.2968, Longitude: 103.8528 },
      { StopSequence: 10, BusStopCode: '04111', RoadName: 'North Bridge Rd', Description: 'Opp The Treasury', DistanceKm: 17.0, Latitude: 1.2911, Longitude: 103.8502 },
      { StopSequence: 11, BusStopCode: '10541', RoadName: 'Spooner Rd', Description: 'Kampong Bahru Ter', DistanceKm: 19.8, Latitude: 1.2764, Longitude: 103.8329 },
    ],
  },
  '14': {
    ServiceNo: '14',
    Operator: 'SBST',
    Direction: 1,
    OriginCode: '84009',
    OriginName: 'Bedok Temp Int',
    DestinationCode: '17179',
    DestinationName: 'Clementi Int',
    FirstBusWeekday: '05:40',
    LastBusWeekday: '23:45',
    FrequencyPeakMin: 6,
    FrequencyOffPeakMin: 11,
    Stops: [
      { StopSequence: 1, BusStopCode: '84009', RoadName: 'Bedok Nth Dr', Description: 'Bedok Temp Int', DistanceKm: 0.0, Latitude: 1.3240, Longitude: 103.9300 },
      { StopSequence: 2, BusStopCode: '82061', RoadName: 'Marine Parade Rd', Description: 'Marine Parade Stn Exit 2', DistanceKm: 4.2, Latitude: 1.3031, Longitude: 103.9062 },
      { StopSequence: 3, BusStopCode: '01012', RoadName: 'Victoria St', Description: 'Hotel Grand Pacific', DistanceKm: 11.5, Latitude: 1.2968, Longitude: 103.8528 },
      { StopSequence: 4, BusStopCode: '03019', RoadName: 'Bras Basah Rd', Description: 'NTUC Income Ctr', DistanceKm: 12.1, Latitude: 1.2974, Longitude: 103.8512 },
      { StopSequence: 5, BusStopCode: '08057', RoadName: 'Orchard Rd', Description: 'Dhoby Ghaut Stn', DistanceKm: 13.0, Latitude: 1.2991, Longitude: 103.8458 },
      { StopSequence: 6, BusStopCode: '03211', RoadName: 'Orchard Rd', Description: 'Somerset Stn', DistanceKm: 13.8, Latitude: 1.3005, Longitude: 103.8390 },
      { StopSequence: 7, BusStopCode: '09048', RoadName: 'Orchard Rd', Description: 'Orchard Stn / Lucky Plaza', DistanceKm: 14.6, Latitude: 1.3044, Longitude: 103.8335 },
      { StopSequence: 8, BusStopCode: '17179', RoadName: 'Commonwealth Ave West', Description: 'Clementi Stn Exit B', DistanceKm: 23.4, Latitude: 1.3152, Longitude: 103.7652 },
    ],
  },
  '65': {
    ServiceNo: '65',
    Operator: 'SBST',
    Direction: 1,
    OriginCode: '75009',
    OriginName: 'Tampines Int',
    DestinationCode: '14141',
    DestinationName: 'HarbourFront Int',
    FirstBusWeekday: '05:30',
    LastBusWeekday: '23:35',
    FrequencyPeakMin: 7,
    FrequencyOffPeakMin: 12,
    Stops: [
      { StopSequence: 1, BusStopCode: '75009', RoadName: 'Tampines Ave 4', Description: 'Tampines Int', DistanceKm: 0.0, Latitude: 1.3533, Longitude: 103.9452 },
      { StopSequence: 2, BusStopCode: '84009', RoadName: 'Bedok Nth Dr', Description: 'Bedok Temp Int', DistanceKm: 6.8, Latitude: 1.3240, Longitude: 103.9300 },
      { StopSequence: 3, BusStopCode: '08057', RoadName: 'Orchard Rd', Description: 'Dhoby Ghaut Stn', DistanceKm: 16.2, Latitude: 1.2991, Longitude: 103.8458 },
      { StopSequence: 4, BusStopCode: '03211', RoadName: 'Orchard Rd', Description: 'Somerset Stn', DistanceKm: 17.0, Latitude: 1.3005, Longitude: 103.8390 },
      { StopSequence: 5, BusStopCode: '09048', RoadName: 'Orchard Rd', Description: 'Orchard Stn / Lucky Plaza', DistanceKm: 17.8, Latitude: 1.3044, Longitude: 103.8335 },
      { StopSequence: 6, BusStopCode: '14141', RoadName: 'Telok Blangah Rd', Description: 'HarbourFront Stn / Vivocity', DistanceKm: 24.1, Latitude: 1.2653, Longitude: 103.8219 },
    ],
  },
  '36': {
    ServiceNo: '36',
    Operator: 'GAS',
    Direction: 1,
    OriginCode: '95109',
    OriginName: 'Changi Airport PTB2',
    DestinationCode: '95109',
    DestinationName: 'Changi Airport Loop via Orchard',
    FirstBusWeekday: '06:00',
    LastBusWeekday: '23:55',
    FrequencyPeakMin: 8,
    FrequencyOffPeakMin: 12,
    Stops: [
      { StopSequence: 1, BusStopCode: '95109', RoadName: 'PTB2 Basement', Description: 'Changi Airport PTB2', DistanceKm: 0.0, Latitude: 1.3551, Longitude: 103.9893 },
      { StopSequence: 2, BusStopCode: '82061', RoadName: 'Marine Parade Rd', Description: 'Marine Parade Stn Exit 2', DistanceKm: 12.4, Latitude: 1.3031, Longitude: 103.9062 },
      { StopSequence: 3, BusStopCode: '01012', RoadName: 'Victoria St', Description: 'Hotel Grand Pacific', DistanceKm: 20.8, Latitude: 1.2968, Longitude: 103.8528 },
      { StopSequence: 4, BusStopCode: '03019', RoadName: 'Bras Basah Rd', Description: 'NTUC Income Ctr', DistanceKm: 21.4, Latitude: 1.2974, Longitude: 103.8512 },
      { StopSequence: 5, BusStopCode: '08057', RoadName: 'Orchard Rd', Description: 'Dhoby Ghaut Stn', DistanceKm: 22.3, Latitude: 1.2991, Longitude: 103.8458 },
      { StopSequence: 6, BusStopCode: '09048', RoadName: 'Orchard Rd', Description: 'Orchard Stn / Lucky Plaza', DistanceKm: 23.9, Latitude: 1.3044, Longitude: 103.8335 },
    ],
  },
  '106': {
    ServiceNo: '106',
    Operator: 'TTS',
    Direction: 1,
    OriginCode: '17009',
    OriginName: 'Jurong East Int',
    DestinationCode: '03539',
    DestinationName: 'Marina Centre Ter / MBS',
    FirstBusWeekday: '05:30',
    LastBusWeekday: '23:45',
    FrequencyPeakMin: 5,
    FrequencyOffPeakMin: 9,
    Stops: [
      { StopSequence: 1, BusStopCode: '17009', RoadName: 'Jurong Gateway Rd', Description: 'Jurong East Int', DistanceKm: 0.0, Latitude: 1.3332, Longitude: 103.7423 },
      { StopSequence: 2, BusStopCode: '17179', RoadName: 'Commonwealth Ave West', Description: 'Clementi Stn Exit B', DistanceKm: 4.8, Latitude: 1.3152, Longitude: 103.7652 },
      { StopSequence: 3, BusStopCode: '09048', RoadName: 'Orchard Rd', Description: 'Orchard Stn / Lucky Plaza', DistanceKm: 14.1, Latitude: 1.3044, Longitude: 103.8335 },
      { StopSequence: 4, BusStopCode: '03211', RoadName: 'Orchard Rd', Description: 'Somerset Stn', DistanceKm: 14.9, Latitude: 1.3005, Longitude: 103.8390 },
      { StopSequence: 5, BusStopCode: '03019', RoadName: 'Bras Basah Rd', Description: 'NTUC Income Ctr', DistanceKm: 16.5, Latitude: 1.2974, Longitude: 103.8512 },
      { StopSequence: 6, BusStopCode: '03539', RoadName: 'Bayfront Ave', Description: 'Marina Bay Sands MICE', DistanceKm: 18.2, Latitude: 1.2838, Longitude: 103.8591 },
    ],
  },
  '857': {
    ServiceNo: '857',
    Operator: 'TTS',
    Direction: 1,
    OriginCode: '59009',
    OriginName: 'Yishun Int',
    DestinationCode: '59009',
    DestinationName: 'Suntec City Loop',
    FirstBusWeekday: '05:45',
    LastBusWeekday: '23:30',
    FrequencyPeakMin: 6,
    FrequencyOffPeakMin: 10,
    Stops: [
      { StopSequence: 1, BusStopCode: '59009', RoadName: 'Yishun Ave 2', Description: 'Yishun Int', DistanceKm: 0.0, Latitude: 1.4294, Longitude: 103.8350 },
      { StopSequence: 2, BusStopCode: '01012', RoadName: 'Victoria St', Description: 'Hotel Grand Pacific', DistanceKm: 18.2, Latitude: 1.2968, Longitude: 103.8528 },
      { StopSequence: 3, BusStopCode: '03019', RoadName: 'Bras Basah Rd', Description: 'NTUC Income Ctr', DistanceKm: 18.9, Latitude: 1.2974, Longitude: 103.8512 },
      { StopSequence: 4, BusStopCode: '08057', RoadName: 'Orchard Rd', Description: 'Dhoby Ghaut Stn', DistanceKm: 19.8, Latitude: 1.2991, Longitude: 103.8458 },
    ],
  },
  '147': {
    ServiceNo: '147',
    Operator: 'SBST',
    Direction: 1,
    OriginCode: '64009',
    OriginName: 'Hougang Central Int',
    DestinationCode: '17179',
    DestinationName: 'Clementi Int',
    FirstBusWeekday: '05:30',
    LastBusWeekday: '23:45',
    FrequencyPeakMin: 7,
    FrequencyOffPeakMin: 11,
    Stops: [
      { StopSequence: 1, BusStopCode: '01012', RoadName: 'Victoria St', Description: 'Hotel Grand Pacific', DistanceKm: 12.0, Latitude: 1.2968, Longitude: 103.8528 },
      { StopSequence: 2, BusStopCode: '04111', RoadName: 'North Bridge Rd', Description: 'Opp The Treasury', DistanceKm: 13.1, Latitude: 1.2911, Longitude: 103.8502 },
      { StopSequence: 3, BusStopCode: '17179', RoadName: 'Commonwealth Ave West', Description: 'Clementi Stn Exit B', DistanceKm: 24.2, Latitude: 1.3152, Longitude: 103.7652 },
    ],
  },
  '166': {
    ServiceNo: '166',
    Operator: 'SBST',
    Direction: 1,
    OriginCode: '54009',
    OriginName: 'Ang Mo Kio Int',
    DestinationCode: '17179',
    DestinationName: 'Clementi Int',
    FirstBusWeekday: '05:30',
    LastBusWeekday: '23:30',
    FrequencyPeakMin: 6,
    FrequencyOffPeakMin: 12,
    Stops: [
      { StopSequence: 1, BusStopCode: '01012', RoadName: 'Victoria St', Description: 'Hotel Grand Pacific', DistanceKm: 11.2, Latitude: 1.2968, Longitude: 103.8528 },
      { StopSequence: 2, BusStopCode: '08057', RoadName: 'Orchard Rd', Description: 'Dhoby Ghaut Stn', DistanceKm: 12.1, Latitude: 1.2991, Longitude: 103.8458 },
      { StopSequence: 3, BusStopCode: '04111', RoadName: 'North Bridge Rd', Description: 'Opp The Treasury', DistanceKm: 13.4, Latitude: 1.2911, Longitude: 103.8502 },
      { StopSequence: 4, BusStopCode: '14141', RoadName: 'Telok Blangah Rd', Description: 'HarbourFront Stn / Vivocity', DistanceKm: 17.5, Latitude: 1.2653, Longitude: 103.8219 },
      { StopSequence: 5, BusStopCode: '17179', RoadName: 'Commonwealth Ave West', Description: 'Clementi Stn Exit B', DistanceKm: 26.8, Latitude: 1.3152, Longitude: 103.7652 },
    ],
  },
};

// Operator attribution details for Singapore public bus companies
export const OPERATOR_DETAILS: Record<BusOperator, { name: string; color: string; badgeBg: string; textClass: string }> = {
  SBST: {
    name: 'SBS Transit',
    color: '#8b1f79',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
    textClass: 'text-purple-700 dark:text-purple-300',
  },
  SMRT: {
    name: 'SMRT Buses',
    color: '#e11d48',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    textClass: 'text-rose-700 dark:text-rose-300',
  },
  TTS: {
    name: 'Tower Transit',
    color: '#16a34a',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    textClass: 'text-emerald-700 dark:text-emerald-300',
  },
  GAS: {
    name: 'Go-Ahead Singapore',
    color: '#eab308',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    textClass: 'text-amber-800 dark:text-amber-300',
  },
};

// Default operator assignment per service
export const SERVICE_OPERATOR_MAP: Record<string, BusOperator> = {
  '14': 'SBST',
  '16': 'SBST',
  '36': 'GAS',
  '51': 'SBST',
  '65': 'SBST',
  '106': 'TTS',
  '124': 'SBST',
  '147': 'SBST',
  '166': 'SBST',
  '174': 'SBST',
  '190': 'SMRT',
  '857': 'TTS',
  '960': 'SMRT',
  '972': 'SMRT',
  '10': 'SBST',
  '7': 'SBST',
};

// Service destination labels
export const SERVICE_DESTINATIONS: Record<string, string> = {
  '14': 'Clementi Int',
  '16': 'Bt Merah Int',
  '36': 'Changi Airport Loop',
  '51': 'Jurong East Int',
  '65': 'HarbourFront Int',
  '106': 'Marina Centre Ter',
  '124': 'St. Michael\'s Ter',
  '147': 'Clementi Int',
  '166': 'Clementi Int',
  '174': 'New Bridge Rd Ter',
  '190': 'Kampong Bahru Ter',
  '857': 'Suntec City Loop',
  '960': 'Marina Ctr Ter',
  '972': 'Orchard Rd / Dhoby Ghaut',
  '10': 'Kent Ridge Ter',
  '7': 'Clementi Int',
};

// Generate deterministic live simulated arrivals for any Singapore bus stop
export function generateLiveArrivalsForStop(busStopCode: string): BusServiceArrival[] {
  const services = STOP_SERVICES_MAP[busStopCode] || ['14', '65', '190'];
  const now = Date.now();
  
  // Use stop code digits to seed pseudo-consistent initial offset cycles
  const stopSeed = busStopCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return services.map((serviceNo, idx) => {
    const operator = SERVICE_OPERATOR_MAP[serviceNo] || (idx % 2 === 0 ? 'SBST' : 'SMRT');
    const serviceSeed = serviceNo.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + stopSeed;

    // Realistic arrival time progression in seconds
    // Next bus: 0 to 4 minutes away
    // Next bus 2: 7 to 15 minutes away
    // Next bus 3: 16 to 24 minutes away
    const cycle = (now / 1000 + serviceSeed * 37) % 900; // 15 min cycle
    
    // Arrival 1 wait seconds
    const waitSec1 = Math.max(10, Math.floor((serviceSeed * 43 + cycle) % 360));
    const waitSec2 = waitSec1 + 420 + Math.floor((serviceSeed * 17) % 300);
    const waitSec3 = waitSec2 + 540 + Math.floor((serviceSeed * 29) % 300);

    const destName = SERVICE_DESTINATIONS[serviceNo] || 'City Centre';

    // Loads
    const loads: LoadLevel[] = ['SEA', 'SEA', 'SDA', 'SDA', 'LSD'];
    const load1 = loads[(serviceSeed + Math.floor(now / 60000)) % loads.length];
    const load2 = loads[(serviceSeed + 2 + Math.floor(now / 60000)) % loads.length];
    const load3 = loads[(serviceSeed + 4 + Math.floor(now / 60000)) % loads.length];

    // Decks: heavily DD on high demand Singapore trunk routes
    const decks: BusDeckType[] = ['DD', 'DD', 'SD', 'DD'];
    const deck1 = decks[(serviceSeed) % decks.length];
    const deck2 = decks[(serviceSeed + 1) % decks.length];
    const deck3 = decks[(serviceSeed + 2) % decks.length];

    // Distance calculation approx 30km/h = 8.33 m/s
    const dist1 = Math.round(waitSec1 * 8.2);
    const dist2 = Math.round(waitSec2 * 8.2);
    const dist3 = Math.round(waitSec3 * 8.2);

    const plateNumber1 = `SG${1000 + (serviceSeed * 31) % 8999}${String.fromCharCode(65 + (serviceSeed % 26))}`;
    const plateNumber2 = `SBS${2000 + (serviceSeed * 47) % 7999}${String.fromCharCode(65 + ((serviceSeed + 3) % 26))}`;
    const plateNumber3 = `SMB${3000 + (serviceSeed * 53) % 6999}${String.fromCharCode(65 + ((serviceSeed + 7) % 26))}`;

    return {
      ServiceNo: serviceNo,
      Operator: operator,
      destinationName: destName,
      category: serviceNo.length >= 3 && serviceNo.startsWith('5') ? 'EXPRESS' : 'TRUNK',
      NextBus: {
        OriginCode: '84009',
        DestinationCode: '17009',
        EstimatedArrival: new Date(now + waitSec1 * 1000).toISOString(),
        Latitude: '1.2982',
        Longitude: '103.8524',
        VisitNumber: '1',
        Load: load1,
        Feature: 'WAB',
        Type: deck1,
        vehiclePlate: plateNumber1,
        speedKmH: Math.floor(25 + (serviceSeed % 25)),
        distanceMeters: dist1,
        stopsAway: Math.max(1, Math.ceil(waitSec1 / 150)),
      },
      NextBus2: {
        OriginCode: '84009',
        DestinationCode: '17009',
        EstimatedArrival: new Date(now + waitSec2 * 1000).toISOString(),
        Latitude: '1.3050',
        Longitude: '103.8410',
        VisitNumber: '1',
        Load: load2,
        Feature: 'WAB',
        Type: deck2,
        vehiclePlate: plateNumber2,
        speedKmH: Math.floor(28 + (serviceSeed % 20)),
        distanceMeters: dist2,
        stopsAway: Math.max(2, Math.ceil(waitSec2 / 150)),
      },
      NextBus3: {
        OriginCode: '84009',
        DestinationCode: '17009',
        EstimatedArrival: new Date(now + waitSec3 * 1000).toISOString(),
        Latitude: '1.3140',
        Longitude: '103.8300',
        VisitNumber: '1',
        Load: load3,
        Feature: 'WAB',
        Type: deck3,
        vehiclePlate: plateNumber3,
        speedKmH: Math.floor(22 + (serviceSeed % 24)),
        distanceMeters: dist3,
        stopsAway: Math.max(4, Math.ceil(waitSec3 / 150)),
      },
    };
  });
}

// Generate active real-time bus GPS locations for map tracking
export function getLiveBusesOnRoute(serviceNo: string, targetStop: BusStop): LiveBusTelemetry[] {
  const route = BUS_ROUTES[serviceNo] || BUS_ROUTES['190'];
  const operator = SERVICE_OPERATOR_MAP[serviceNo] || 'SBST';
  const now = Date.now();
  const seed = serviceNo.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  // Synthesize 3-4 active buses currently en route along the stop coordinates
  const stops = route.Stops;
  if (!stops || stops.length === 0) return [];

  const buses: LiveBusTelemetry[] = [];
  const numBuses = 3;

  for (let i = 0; i < numBuses; i++) {
    // Determine position along the stop line
    const progressOffset = ((now / 40000 + (i * 0.3) + (seed * 0.1)) % 1);
    const stopFloatIndex = progressOffset * (stops.length - 1);
    const stopIndex = Math.floor(stopFloatIndex);
    const nextStopIndex = Math.min(stops.length - 1, stopIndex + 1);

    const s1 = stops[stopIndex];
    const s2 = stops[nextStopIndex];
    const segFraction = stopFloatIndex - stopIndex;

    const lat = s1.Latitude + (s2.Latitude - s1.Latitude) * segFraction;
    const lng = s1.Longitude + (s2.Longitude - s1.Longitude) * segFraction;

    // Approximate bearing in degrees
    const dLng = s2.Longitude - s1.Longitude;
    const dLat = s2.Latitude - s1.Latitude;
    const bearing = Math.round((Math.atan2(dLng, dLat) * 180) / Math.PI + 360) % 360;

    const distanceMeters = Math.round(
      Math.sqrt(Math.pow(lat - targetStop.Latitude, 2) + Math.pow(lng - targetStop.Longitude, 2)) * 111000
    );
    const etaMinutes = Math.max(1, Math.round(distanceMeters / 450));

    const loadLevels: LoadLevel[] = ['SEA', 'SDA', 'LSD'];
    const busLoad = loadLevels[(i + seed) % loadLevels.length];

    buses.push({
      id: `bus-${serviceNo}-${i}`,
      serviceNo,
      operator,
      plate: `SG${3000 + i * 820 + (seed % 400)}K`,
      latitude: lat,
      longitude: lng,
      bearing,
      speed: 28 + ((seed + i * 5) % 20),
      load: busLoad,
      type: i === 1 ? 'SD' : 'DD',
      feature: 'WAB',
      nextStopCode: s2.BusStopCode,
      nextStopName: s2.Description,
      destinationName: route.DestinationName,
      etaMinutes,
      distanceMeters,
      updatedAt: now,
    });
  }

  return buses;
}
