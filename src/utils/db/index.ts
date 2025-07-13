import ExpoSQLiteDialect from "@expo/knex-expo-sqlite-dialect";
import Knex from "knex";

import { jokes } from "@/src/assets/jokes";

const index = Knex({
	client: ExpoSQLiteDialect,
	connection: {
		filename: 'jokes.db',
	},
	useNullAsDefault: true,
});

export async function initDb() {
	const hasTable = await index.schema.hasTable('jokes');
	if (!hasTable) {
		await index.schema.createTable('jokes', (table) => {
			table.increments('id');
			table.string('text');
			table.boolean('seen').defaultTo(false);
		});
	}
	// Populate jokes if table is empty
	const count = await index('jokes').count<{ count: number }>('id as count').first();
	if (count && count.count === 0) {
		await index('jokes').insert(jokes.map(text => ({ text, seen: false })));
	}
}

export async function destroyDb() {
	await index.destroy();
}

export default index;
