export interface Bird {
	id: string;
	name: string;
	latinName: string;
	image: string;
	description?: string;
}

export const birds: Bird[] = [
	{
		id: 'kohlmeise',
		name: 'Kohlmeise',
		latinName: 'Parus major',
		image: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Parus_major_m.jpg',
		description: 'Die Kohlmeise ist die größte und am weitesten verbreitete Meise in Europa.'
	},
	{
		id: 'blaumeise',
		name: 'Blaumeise',
		latinName: 'Cyanistes caeruleus',
		image: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Cyanistes_caeruleus_non-breeding_plumage.jpg',
		description: 'Die lebhafte und geschickte Blaumeise ist wenig scheu. Sie erscheint im Winter oft am Futterhaus.'
	},
	{
		id: 'amsel',
		name: 'Amsel',
		latinName: 'Turdus merula',
		image: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Turdus_merula_male_3.jpg',
		description: 'Die Amsel oder Schwarzdrossel ist eine in Europa sehr häufige Vogelart.'
	},
	{
		id: 'turmfalke',
		name: 'Turmfalke',
		latinName: 'Falco tinnunculus',
		image: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Falco_tinnunculus_1.jpg',
		description: 'Der Turmfalke ist der am häufigsten vorkommende Falke in Mitteleuropa.'
	},
	{
		id: 'kiebitz',
		name: 'Kiebitz',
		latinName: 'Vanellus vanellus',
		image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Vanellus_vanellus_%281%29.jpg',
		description: 'Der Kiebitz ist ein markanter Watvogel mit einer typischen Federholle.'
	}
];
