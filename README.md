# zammad-webhook-discord-mentions

Simple webhook tranformation tool for zammad to provide Discord user pings for Zammad mentions via Discord webhooks.

## Configuration

Copy `config-template.json` to `config.json` and set up the required values for your use case.

To attain a Discord webhook, rightclick on the Discord channel you want to send notifications in and choose "Edit channel",
then go to "Integrations" and set up a new webhook there.

For Zammad agent IDs search for the agent in Zammad and copy the ID from their user view, eg. https://zammad.example.org/#user/profile/<ID HERE>.
For Discord user IDs, enable the developer mode inside of discord,
and afterwards right click the usernames of your mentionable agents and click "Copy ID".
The name field in the config is used as a fallback if no ID is provided.

## Zammad configuration

- Create a new webhook pointing to your configured hostname, port and webhook path.
- Then create a trigger with the condition that the Text contains `data-mention-user-id` & uses the webhook as the action.
