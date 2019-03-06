import * as eventFederator from '@amisolertis/utils-eventfederator';
import * as amiconfig from '@amisolertis/utils-config';
const redis = amiconfig.getConfig(amiconfig.getEnvironment()).redis;

let eventClient = eventFederator.createClient(
  redis.getIP(),
  redis.getPort(),
  redis.getPassword()
);

export function ThingCreated(newThing: any): void {
  let message = {
    status: 'created',
    data: newThing
  };

  eventClient.PublishTo('things', JSON.stringify(message));
}
