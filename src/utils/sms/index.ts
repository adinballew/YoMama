import * as SMS from 'expo-sms';

export async function sendSmsAsync(recipients: string[], message: string) {
	const isAvailable = await SMS.isAvailableAsync();
	if (!isAvailable) {
		throw new Error('SMS is not available on this device');
	}
	const { result } = await SMS.sendSMSAsync(recipients, message);
	return result; // 'sent', 'cancelled', or 'unknown'
}

