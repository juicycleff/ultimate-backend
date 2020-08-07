interface CommandServerConfig {
  address: string;
  port: string;
  username: string;
  password: string;
  secret?: string;
  tenantId: string;
}

interface HeartBeatPayloadConfig {
  tenantId: string;
  deviceId: string;
  tenantKey: string;
  status?: string;
  watchdog?: boolean;
  timestamp?: Date;
}

export type MqttCommandConfig =
  | {
      command: 'update-wifi-list';
      accessPoints: Array<{
        ssid: string;
        password: string;
      }>;
    }
  | {
      command: 'update-mac-list';
      devices: string[];
    }
  | {
      command: 'update-mqtt-credentials';
      server: CommandServerConfig;
    }
  | {
      command: 'update-send-rate';
      sendRate: string;
    }
  | {
      command: 'reboot';
    }
  | {
      command: 'run-ota-update';
      url: string;
    }
  | {
      command: 'full-config-update';
      accessPoints?: Array<{
        ssid: string;
        password: string;
      }>;
      server?: CommandServerConfig;
      devices?: string[];
      settings?: {
        sendRate?: string;
      };
    };
