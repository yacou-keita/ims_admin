import { NbMenuItem } from '@nebular/theme';
import { title } from 'process';

export const MENU_ITEMS: NbMenuItem[] = [
 
  {
    title: 'Appointment Center',
    link: '/appointment',
    icon: 'calendar-outline',
   
  },
  {
    title:'Message Center',
    link: '/messagecenter',
    icon:{
      icon:'inbox',
      pack:'fa'
    },
    
  },
  {
    title:'Notifications',
    icon:'bell-outline',
    link:'/notification'
    
  },
  {
    title:'School Documents',
    icon:{
      icon:'book',
      pack:'fa'
    },
    link: '/schooldocuments'
  },
  {
    title: 'Teachers & Admins',
    icon: 'people-outline',
    link: '/users',
    
  },
  {
    title: 'Children`s Information',
    icon: 'globe-outline',
    link:'/children',
    home:true
  },
  {
    title: 'Menu of This Year',
    link:  '/menuofyear',
    icon: 'clipboard-outline'
  },
  {
    title: 'Photos',
    link: '/admin/pictures/',
    icon: 'image-outline',
  },
  // {
  //   title:'Child Daily Information',
  //   icon:'credit-card-outline',
  //   children:[
  //     {
  //       title:'Add Meal',
  //       link:'/menuofyear/food/new'
  //     },
  //     {
  //       title: 'Menu of This Year',
  //       link: '/menuofyear'
  //     }
  //   ]
  // },
  {
    title:'Mini Club',
    icon:'speaker-outline',
    link:'/miniclub'    
  },
  {
    title:'Exchange Library',
    icon:'book-outline',
    link:'/exchangelibrary'    
  },
  {
    title:'Marketing',
    icon:'globe-2-outline',
    link:'/marketing'
  }
  
  // {
  //   title: 'ListStudent',
  //   icon: 'menu-outline',
  //   link: '/list'    
  // },
  // {
  //   title: 'AddStudent',
  //   icon: 'plus-outline',
  //   link: '/add'
  // },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  // {
  //   title: 'Auth',
  //   icon: 'lock-outline',
  //   children: [
  //     {
  //       title: 'Login',
  //       link: '/auth/login',
  //     },
  //     {
  //       title: 'Register',
  //       link: '/auth/register',
  //     },
  //     {
  //       title: 'Request Password',
  //       link: '/auth/request-password',
  //     },
  //     {
  //       title: 'Reset Password',
  //       link: '/auth/reset-password',
  //     },
  //   ],
  // },
];

export const TEACHER_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Children',
    icon: 'globe-outline',
    link:'/children',
    home:true
  },
  {
    title: 'Pictures',
    icon: 'image-outline',
    children: [
      {
        title: 'Add',
        link: '/teacher/pictures/'
      },
      {
        title: 'List',
        link: '/teacher/pictures'
      }
    ]
  },
  {
    title:'School Documents',
    icon:{
      icon:'book',
      pack:'fa'
    },
    link: '/teacher/schooldocuments'
  },
  {
    title:'Message Center',
    icon:{
      icon:'inbox',
      pack:'fa'
    },
    children:[
      {
        title:'Inbox',
        link: '/teacher/messagecenter',
      },
      {
        title:'Compose',
        link:'/teacher/messagecenter/compose'
      }
    ]
  },
  {
    title:'Child Daily Information',
    icon:'credit-card-outline',
    link:'/teacher/childdailyinformation'
    
  },
  
  // {
  //   title:'Notifications',
  //   icon:'bell-outline',
  //   children:[
  //     {
  //       title:'Send',
  //       link:'/notification/send'
  //     }
      
  //   ]

  // },
  
  // {
  //   title: 'ListStudent',
  //   icon: 'menu-outline',
  //   link: '/list'    
  // },
  // {
  //   title: 'AddStudent',
  //   icon: 'plus-outline',
  //   link: '/add'
  // },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  // {
  //   title: 'Auth',
  //   icon: 'lock-outline',
  //   children: [
  //     {
  //       title: 'Login',
  //       link: '/auth/login',
  //     },
  //     {
  //       title: 'Register',
  //       link: '/auth/register',
  //     },
  //     {
  //       title: 'Request Password',
  //       link: '/auth/request-password',
  //     },
  //     {
  //       title: 'Reset Password',
  //       link: '/auth/reset-password',
  //     },
  //   ],
  // },
];
