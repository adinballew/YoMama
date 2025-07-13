import Constants from 'expo-constants';
import * as Contacts from 'expo-contacts';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { getContactsWithPermission } from '@/src/utils/contacts';
import knex, { initDb, destroyDb } from '@/src/utils/db';
import { sendSmsAsync } from '@/src/utils/sms';


export default function App() {
	const [error, setError] = useState<string | null>(null);
	const [joke, setJoke] = useState<string | null>(null);
	const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
	const [outOfJokes, setOutOfJokes] = useState(false);
	const [loading, setLoading] = useState(true);

	// Initialization: only run once on mount
	useEffect(() => {
		(async () => {
			await initDb();
			try {
				const data = await getContactsWithPermission();
				if (data.length > 0) {
					setContacts(data);
				} else {
					setError('No contacts found');
				}
			} catch (err: any) {
				setError(err.message || 'Contacts permission not granted');
			}
			setLoading(false);
		})();
		return () => {
			void destroyDb();
		};
	}, []);

	// Log joke when it changes
	useEffect(() => {
		if (joke !== null) {
			console.log('joke', joke);
		}
	}, [joke]);

	async function showJoke() {
		setLoading(true);
		// Get a random unseen joke
		const result = await knex('jokes').where({ seen: false }).select('id', 'text');
		if (!result || result.length === 0) {
			setJoke(null);
			setOutOfJokes(true);
			setLoading(false);
			return;
		}
		// Pick a random joke from the unseen ones
		const randomJoke = result[Math.floor(Math.random() * result.length)];
		setJoke(randomJoke.text);

		// Mark as seen
		await knex('jokes').where({ id: randomJoke.id }).update({ seen: true });
		setLoading(false);
	}

	async function resetJokes() {
		setLoading(true);
		await knex('jokes').update({ seen: false });
		setJoke(null);
		setOutOfJokes(false);
		setLoading(false);
	}

	async function sendSmsJokeAsync() {
		if (!joke) {
			setError('No joke to send');
			return;
		}

		const recipients = contacts.map(contact => {
			if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
				return contact.phoneNumbers[0].number;
			}
			return null;
		}).filter(num => num !== null) as string[];

		if (recipients.length === 0) {
			setError('No valid phone numbers found in contacts');
			return;
		}

		try {
			const result = await sendSmsAsync(recipients, joke);
			if (result === 'sent') {
				setError(null);
				alert('Joke sent successfully!');
			} else {
				setError('Failed to send joke');
			}
		} catch (err: any) {
			setError(err.message || 'Failed to send SMS');
		}
	}

	return (
		<View style={styles.container}>
			{error && (
				<Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>
			)}
			<Text style={styles.heading}>Yo Mama Jokes</Text>
			<View style={styles.jokeBox}>
				{loading ? (
					<Text>Loading...</Text>
				) : outOfJokes ? (
					<Text style={styles.jokeText}>Out of Jokes</Text>
				) : joke ? (
					<Text style={styles.jokeText}>{joke}</Text>
				) : (
					<Text style={styles.jokeText}>Press the button for a joke!</Text>
				)}
			</View>
			<Text style={styles.heading}>Contacts</Text>
			<View style={styles.jokeBox}>
				{loading ? (
					<Text>Loading Contacts...</Text>
				) : contacts.length > 0 ? (
					contacts.map((contact, index) => (
						<Text key={index} style={styles.jokeText}>
							{contact.name || 'Unnamed Contact'}
							{contact.phoneNumbers && contact.phoneNumbers.length > 0
								? ` - ${contact.phoneNumbers[0].number}`
								: ''}
							{ contact.emails && contact.emails.length > 0 ? ` - ${contact.emails[0].email}` : ''}
						</Text>
					))
				) : (
					<Text style={styles.jokeText}>No contacts found</Text>
				)}
			</View>
			<Button
				title="Show Me a Joke"
				onPress={showJoke}
				disabled={loading || outOfJokes}
			/>
			<Button
				title="Send Joke to Contacts"
				onPress={sendSmsJokeAsync}
				disabled={loading || outOfJokes}
			></Button>
			<View style={{ height: 16 }} />
			<Button
				title="Reset Jokes"
				onPress={resetJokes}
				disabled={loading}
				color="#888"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1,
		paddingTop: Constants.statusBarHeight,
		alignItems: 'center',
		justifyContent: 'center',
	},
	heading: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 24,
	},
	jokeBox: {
		minHeight: 100,
		minWidth: 300,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 24,
		padding: 16,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		backgroundColor: '#f9f9f9',
	},
	jokeText: {
		fontSize: 18,
		textAlign: 'center',
	},
});
