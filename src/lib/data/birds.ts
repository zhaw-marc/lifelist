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
		image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Great_tit_%28Parus_major%29%2C_Parc_du_Rouge-Cloitre%2C_For%C3%AAt_de_Soignes%2C_Brussels_%2826194636951%29.jpg/960px-Great_tit_%28Parus_major%29%2C_Parc_du_Rouge-Cloitre%2C_For%C3%AAt_de_Soignes%2C_Brussels_%2826194636951%29.jpg',
		description: 'Die Kohlmeise ist die größte und am weitesten verbreitete Meise in Europa.'
	},
	{
		id: 'blaumeise',
		name: 'Blaumeise',
		latinName: 'Cyanistes caeruleus',
		image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Eurasian_blue_tit_%28Cyanistes_caeruleus_caeruleus%29_Biebrzanski.jpg/960px-Eurasian_blue_tit_%28Cyanistes_caeruleus_caeruleus%29_Biebrzanski.jpg',
		description: 'Die lebhafte und geschickte Blaumeise ist wenig scheu. Sie erscheint im Winter oft am Futterhaus.'
	},
	{
		id: 'amsel',
		name: 'Amsel',
		latinName: 'Turdus merula',
		image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Common_Blackbird.jpg/960px-Common_Blackbird.jpg',
		description: 'Die Amsel oder Schwarzdrossel ist eine in Europa sehr häufige Vogelart.'
	},
	{
		id: 'turmfalke',
		name: 'Turmfalke',
		latinName: 'Falco tinnunculus',
		image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Common_kestrel_falco_tinnunculus.jpg/960px-Common_kestrel_falco_tinnunculus.jpg',
		description: 'Der Turmfalke ist der am häufigsten vorkommende Falke in Mitteleuropa.'
	},
	{
		id: 'kiebitz',
		name: 'Kiebitz',
		latinName: 'Vanellus vanellus',
		image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Northern-Lapwing-Vanellus-vanellus.jpg/960px-Northern-Lapwing-Vanellus-vanellus.jpg',
		description: 'Der Kiebitz ist ein markanter Watvogel mit einer typischen Federholle.'
	}
];
