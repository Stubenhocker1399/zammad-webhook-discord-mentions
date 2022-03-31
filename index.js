import express from "express";
import bodyParser from "body-parser";
import fetch from 'node-fetch';
import { readFile } from 'fs/promises';
import { exit } from "process";

const app = express();

const config = JSON.parse(
	await readFile(
		new URL('./config.json', import.meta.url)
	)
);

if (!config.url || !config.users) {
	console.log('No valid config.json found, please create one based on config-template.json');
	exit(1);
}

function getMentionFromId(id) {
	const user = config.users.filter(u => u.id === id)?.[0];
	if (user) {
		return user.discordId ? `<@${user.discordId}> ` : `@${user.name} `;
	}
	return '@unknown '
}

app.use(bodyParser.json());

const idMatcher = new RegExp(/data-mention-user-id="(\d+)"/gm);

app.post(config.webhookPath, (req, res) => {
	const article = req.body.article;
	const ticket = req.body.ticket;
	const matches = [...article.body.matchAll(idMatcher)].map(m => m[1]);

	if (matches.length === 0) {
		return res.status(200).end();
	}

	let message = '';

	for (const match of matches) {
		message += getMentionFromId(match);
	}

	message += `You have been mentioned by ${article.from.trim()} in Ticket ${config.url}${ticket.id}`;

	console.log(message);

	fetch(config.discordWebhook, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ content: message }),
	});

	res.status(200).end();
})

app.listen(config.port, config.hostname, () => console.log(`Server listening for zammad webhooks on ${config.hostname}:${config.port}${config.webhookPath}`));
