import { Artist } from '../types/artist';

export const ARTIST_MOCKS: Artist[] = [
  {
    id: '1',
    slug: 'son-tung',
    name: 'Sơn Tùng M-TP',

    avatarUrl: 'https://placehold.co/600x600',
    coverUrl: 'https://placehold.co/1600x900',

    tagline: {
      vi: 'Ngôi sao nhạc pop hàng đầu Việt Nam',
      en: 'Vietnamese pop superstar',
    },

    bio: {
      short: {
        vi: 'Sơn Tùng M-TP là nghệ sĩ pop có sức ảnh hưởng lớn, nổi bật với phong cách âm nhạc hiện đại và hình ảnh chỉn chu.',
        en: 'Son Tung M-TP is a highly influential Vietnamese pop artist known for modern sounds and strong visual identity.',
      },
      full: {
        vi: `Sơn Tùng M-TP là một trong những nghệ sĩ có sức ảnh hưởng lớn nhất của nền âm nhạc Việt Nam đương đại.
Âm nhạc của anh kết hợp giữa pop hiện đại, R&B và màu sắc cá nhân rất rõ nét.

Với hàng loạt bản hit và phong cách hình ảnh chỉn chu, Sơn Tùng không chỉ là ca sĩ mà còn là biểu tượng văn hoá đại chúng.`,
        en: `Son Tung M-TP is one of the most influential contemporary Vietnamese pop artists.
His music blends modern pop, R&B, and a strong personal identity.

Beyond music, he is also a cultural icon known for his distinctive visuals and artistic direction.`,
      },
      highlights: {
        vi: [
          'Nhiều bản hit đạt hàng trăm triệu lượt nghe',
          'Phong cách hình ảnh và concept âm nhạc nhất quán',
        ],
        en: [
          'Multiple chart-topping hits',
          'Strong and consistent artistic branding',
        ],
      },
    },

    genres: ['Pop', 'V-Pop', 'R&B'],
    location: 'Ho Chi Minh City, Vietnam',

    socials: {
      facebook: 'https://facebook.com/sontungmtp',
      instagram: 'https://instagram.com/sontungmtp',
      youtube: 'https://youtube.com/@sontungmtp',
      spotify: 'https://open.spotify.com/artist/xyz',
    },

    tracks: [
      {
        id: 'st1',
        title: 'Lạc Trôi',
        coverUrl: 'https://placehold.co/500x500',
        embedUrl: 'https://open.spotify.com/embed/track/xyz',
        releaseYear: 2017,
      },
      {
        id: 'st2',
        title: 'Chạy Ngay Đi',
        coverUrl: 'https://placehold.co/500x500',
        embedUrl: 'https://open.spotify.com/embed/track/abc',
        releaseYear: 2018,
      },
    ],
  },

  {
    id: '2',
    slug: 'den-vau',
    name: 'Đen Vâu',

    avatarUrl: 'https://placehold.co/600x600',
    coverUrl: 'https://placehold.co/1600x900',

    tagline: {
      vi: 'Rapper của những câu chuyện đời',
      en: 'Storyteller of Vietnamese hip-hop',
    },

    bio: {
      short: {
        vi: 'Đen Vâu là rapper nổi bật với phong cách kể chuyện mộc mạc và góc nhìn sâu sắc về đời sống.',
        en: 'Den Vau is a rapper known for raw storytelling and thoughtful social perspectives.',
      },
      full: {
        vi: `Đen Vâu là rapper nổi bật với phong cách kể chuyện mộc mạc, gần gũi và đầy chất đời.
Âm nhạc của anh phản ánh những suy tư về xã hội, cuộc sống và con người Việt Nam hiện đại.`,
        en: `Den Vau is known for his raw, narrative-driven hip-hop style.
His music reflects everyday stories, social thoughts, and a deeply Vietnamese perspective.`,
      },
      highlights: {
        vi: [
          'Phong cách kể chuyện chân thực',
          'Âm nhạc phản ánh xã hội hiện đại',
        ],
        en: [
          'Narrative-driven hip-hop',
          'Strong social themes',
        ],
      },
    },

    genres: ['Hip-hop', 'Rap'],
    location: 'Quang Ninh, Vietnam',

    socials: {
      facebook: 'https://facebook.com/denvau',
      youtube: 'https://youtube.com/@denvau',
      spotify: 'https://open.spotify.com/artist/den',
    },

    tracks: [
      {
        id: 'dv1',
        title: 'Bài Này Chill Phết',
        coverUrl: 'https://placehold.co/500x500',
        embedUrl: 'https://open.spotify.com/embed/track/chill',
        releaseYear: 2019,
      },
    ],
  },

  {
    id: '3',
    slug: 'mer',
    name: 'Mer',

    avatarUrl: 'https://placehold.co/600x600',
    coverUrl: 'https://placehold.co/1600x900',

    tagline: {
      vi: 'Âm nhạc cho những kẻ mơ giữa thành phố',
      en: 'Music for urban dreamers',
    },

    bio: {
      short: {
        vi: 'Mer là nghệ sĩ indie với âm nhạc mơ màng, tối giản, dành cho những khoảnh khắc cần chậm lại.',
        en: 'Mer is an indie artist creating dreamy, minimal music for quiet moments.',
      },
      full: {
        vi: `Mer là một nghệ sĩ indie với âm nhạc mang màu sắc mơ màng, tối giản và giàu cảm xúc.
Lấy cảm hứng từ những đêm dài trong thành phố, Mer kể những câu chuyện về cô đơn, yêu thương và hành trình tìm chính mình.

Âm nhạc của Mer phù hợp để nghe một mình, khi bạn cần chậm lại giữa thế giới ồn ào.`,
        en: `Mer is an indie artist whose music is dreamy, minimal, and emotionally driven.
Inspired by long nights in the city, Mer tells stories about solitude, love, and self-discovery.

Her music is meant for solitary listening — a pause in a noisy world.`,
      },
      highlights: {
        vi: [
          'Âm nhạc mơ màng, giàu cảm xúc',
          'Phù hợp cho không gian nghe riêng tư',
        ],
        en: [
          'Dreamy and emotional sound',
          'Made for intimate listening',
        ],
      },
    },

    genres: ['Indie', 'Alternative', 'Dream Pop'],
    location: 'Ho Chi Minh City, Vietnam',

    socials: {
      instagram: 'https://instagram.com/mer.music',
      soundcloud: 'https://soundcloud.com/mer',
      spotify: 'https://open.spotify.com/artist/mer',
    },

    tracks: [
      {
        id: 'mer1',
        title: 'Midnight Blue',
        coverUrl: 'https://placehold.co/500x500',
        embedUrl: 'https://open.spotify.com/embed/track/midnight',
        releaseYear: 2023,
      },
      {
        id: 'mer2',
        title: 'Slow Waves',
        coverUrl: 'https://placehold.co/500x500',
        embedUrl: 'https://open.spotify.com/embed/track/waves',
        releaseYear: 2024,
      },
    ],
  },
];
