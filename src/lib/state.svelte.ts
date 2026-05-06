export const captureState = $state({
	selectedBirdId: null as string | null,
	location: null as { lat: number; lng: number } | null,
	date: new Date().toISOString().split('T')[0],
	time: new Date().toTimeString().split(' ')[0].slice(0, 5)
});

export function resetCapture() {
	captureState.selectedBirdId = null;
	captureState.location = null;
	captureState.date = new Date().toISOString().split('T')[0];
	captureState.time = new Date().toTimeString().split(' ')[0].slice(0, 5);
}
