
import {PlaceHolderImages} from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'كعك ورقة',
    description: 'جوهرة الحلويات التونسية. عجينة رقيقة محشوة بعجينة اللوز الفاخرة، معطرة بماء الورد النقي.',
    price: 40.00,
    imageUrl: PlaceHolderImages.find(img => img.id === 'kaak-warka-item')?.imageUrl || '',
    category: 'تقليدي'
  },
  {
    id: 'p2a',
    name: 'بقلاوة بالزوزة',
    description: 'طبقات رقيقة مقرمشة محشوة بأجود أنواع الجوز (الزوزة) ومسقية بالعسل العطري الأصيل.',
    price: 65.00,
    imageUrl: PlaceHolderImages.find(img => img.id === 'baklawa')?.imageUrl || '',
    category: 'بالعسل'
  },
  {
    id: 'p2b',
    name: 'بقلاوة لوز و بوفريوة',
    description: 'مزيج ملكي بين اللوز والبندق (البوفريوة) المحمص، يقدم طعماً غنياً وفريداً في كل قطعة.',
    price: 65.00,
    imageUrl: PlaceHolderImages.find(img => img.id === 'baklawa')?.imageUrl || '',
    category: 'بالعسل'
  },
  {
    id: 'p2c',
    name: 'بقلاوة فزدق',
    description: 'الفخامة في أبهى صورها. محشوة بالفستق الأخضر الفاخر والمنتقى بعناية لتقديم تجربة تذوق استثنائية.',
    price: 70.00,
    imageUrl: PlaceHolderImages.find(img => img.id === 'baklawa')?.imageUrl || '',
    category: 'بالعسل'
  },
  {
    id: 'p3',
    name: 'مقروض',
    description: 'المفضل التقليدي من القيروان. حلوى السميد المحشوة بالتمر، ذهبية ومغموسة في العسل.',
    price: 15.00,
    imageUrl: PlaceHolderImages.find(img => img.id === 'makroudh')?.imageUrl || '',
    category: 'تقليدي'
  },
  {
    id: 'p4a',
    name: 'غريبة حمص',
    description: 'غريبة الحمص التقليدية والذائبة في الفم، مصنوعة من أجود أنواع دقيق الحمص التونسي.',
    price: 26.00,
    imageUrl: PlaceHolderImages.find(img => img.id === 'ghraiba')?.imageUrl || '',
    category: 'بسكويت'
  },
  {
    id: 'p4b',
    name: 'غريبة درع',
    description: 'غريبة الدرع الصحية والشهية، غنية بالفوائد الغذائية والمذاق التونسي الأصيل.',
    price: 24.00,
    imageUrl: PlaceHolderImages.find(img => img.id === 'ghraiba')?.imageUrl || '',
    category: 'بسكويت'
  },
  {
    id: 'p5',
    name: 'ملبس',
    description: 'حلويات لوز أنيقة ومغطاة بطبقة رقيقة من السكر، تشتهر بها مدينة صفاقس العريقة.',
    price: 40.00,
    imageUrl: PlaceHolderImages.find(img => img.id === 'mlabes')?.imageUrl || '',
    category: 'فاخر'
  },
  {
    id: 'p6',
    name: 'ڨراوش',
    description: 'حلويات تقليدية مقرمشة، معسلة ومزينة بالجلجلان، تتميز بمذاقها التونسي الأصيل.',
    price: 23.00,
    imageUrl: PlaceHolderImages.find(img => img.id === 'griwech')?.imageUrl || '',
    category: 'تقليدي'
  },
  {
    id: 'p7',
    name: 'زوزة',
    description: 'حلوى الزوزة الشهيرة بشكل حبة الجوز، محشوة بالكراميل الغني ومزينة بالفستق المقرمش على الأطراف.',
    price: 35.00,
    imageUrl: PlaceHolderImages.find(img => img.id === 'zouza')?.imageUrl || '',
    category: 'حلويات'
  }
];
