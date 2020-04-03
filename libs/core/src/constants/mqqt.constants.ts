export const MQTT_POINT_TERM = 'POINT';
export const MQTT_POINT_CONNECTED = `${MQTT_POINT_TERM}/CONNECTED`;
export const MQTT_POINT_HEARTBEAT = `${MQTT_POINT_TERM}/HEARTBEAT`;

export const MQTT_POINT_REGISTERED = (deviceId: string) => `${MQTT_POINT_TERM}/${deviceId}/REGISTERED`;
export const MQTT_POINT_CONFIGURED = (deviceId: string) => `${MQTT_POINT_TERM}/${deviceId}/CONFIGURED`;
export const MQTT_POINT_PUSHED = `${MQTT_POINT_TERM}/PUSHED`;
