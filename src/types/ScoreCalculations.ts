import {Dictionary} from "@/types/Dictionary";
import {UserId} from "@/types/User";
import {SessionId} from "@/types/RaceSession";

export interface ScoreCalculations {
  /**
   * Points by position and session. The first key is the user id, the second key is the position, the value is the points for that position. For example:
   * {
   *   "1": { // user id
   *     "1": 25, // position 1 -> 25 points
   *     "2": 18, // position 2 -> 18 points
   *     ...
   *   },
   *   "2": { // another user id
   *     "1": 25,
   *     "2": 18,
   *     ...
   *   },
   *   ...
   * }
   */
  pointsByPosition: Dictionary<SessionId, Dictionary<UserId, number>>

  /**
   * Hit amount by each user for this RaceSession. The key is the user id, the value is the amount of hits for that user. For example:
   * {
   *   "1": 5, // user id 1 has 5 hits
   *   "2": 3, // user id 2 has 3 hits
   *   ...
   * }
   */
  hitsAmount: Dictionary<UserId, number>

  /**
   * Hit amount by each user and session. The first key is the user id, the second key is the session id, the value is the amount of hits for that user and session. For example:
   * {
   *   "1": { // user id
   *     "1": 3, // session id -> 3 hits
   *     "2": 2, // session id -> 2 hits
   *     ...
   *   },
   *   "2": { // another user id
   *     "1": 1,
   *     "2": 4,
   *     ...
   *   },
   *   ...
   * }
   */
  hitsBySession: Dictionary<UserId, Dictionary<SessionId, number>>

  /**
   * Total hits by user in the Grand Prix. The key is the user id, the value is the total amount of hits for that user. For example:
   * {
   *   "1": 5, // user id 1 has 5 total hits
   *   "2": 3, // user id 2 has 3 total hits
   *   ...
   * }
   */
  totalHits: Dictionary<UserId, UserId>
}
