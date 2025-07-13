import * as Contacts from 'expo-contacts';

export async function getContactsWithPermission() {
	const { status } = await Contacts.requestPermissionsAsync();
	if (status !== 'granted') {
		throw new Error('Contacts permission not granted');
	}
	const { data } = await Contacts.getContactsAsync({
		fields: [
			Contacts.Fields.FirstName,
			Contacts.Fields.LastName,
			Contacts.Fields.PhoneNumbers,
		],
	});
	return data;
}

