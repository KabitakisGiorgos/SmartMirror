
/**
 *  Notifications
 * @var {string} severity
 * @var {string} text
 * @var {string} type
 */
export interface Notification {
    severity: string,
    text: string,
    type: string //FIXME: this might become enum
}