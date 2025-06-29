import type { BaseFormFieldProps } from '@/types'

export const menuFields: Omit<BaseFormFieldProps, 'text'>[] = [
  {
    key: 'name',
    name: '메뉴명',
    label: '메뉴명',
    placeholder: '메뉴명을 입력하세요.',
    disabled: false,
    maxlength: 20,
    counter: true,
    type: 'text',
    autofocus: true,
    color: true,
    message: '메뉴명을 확인해주세요.',
    rule: [
      (v: string) => !!v || '메뉴명은 필수 입력사항입니다.',
      (v: string) => !(v && v.length > 20) || '메뉴명은 20자 이상 입력할 수 없습니다.',
    ],
  },
  {
    key: 'roles',

    name: '메뉴권한',
    label: '메뉴권한',
    placeholder: '메뉴권한을 입력하세요.',
    disabled: false,
    maxlength: null,
    counter: false,
    type: 'checkbox',
    autofocus: false,
    color: true,
    fetchUrl: '/api/constants/roles',
    message: '메뉴권한을 확인해주세요.',
    rule: [(v: string) => v.length!==0 || '메뉴 권한은 필수입니다.'],
  },
  {
    key: 'parentId',

    name: '상위메뉴',
    label: '상위메뉴',
    placeholder: '상위메뉴를 입력하세요.',
    disabled: false,
    maxlength: null,
    counter: false,
    type: 'combo',
    autofocus: false,
    color: true,
    message: '상위메뉴를 확인해주세요.',
    rule: [],
    fetchUrl: '/api/menus?id=all',
    appendItems:[{ id:null,name:'최상위메뉴' }],
    itemLabel:'name',
    itemValue:'id',
  },
  {
    key: 'seq',

    name: '메뉴순서',
    label: '메뉴순서',
    placeholder: '메뉴순서를 입력하세요.',
    disabled: false,
    maxlength: null,
    counter: false,
    type: 'number',
    autofocus: false,
    color: true,
    message: '메뉴순서를 확인해주세요.',
    rule: [
      (v: string) => (v !== undefined && v !== '' && v !== null) || '메뉴순서는 필수 입력사항입니다.',
      (v: string) => /^[0-9\s]*$/.test(v) || '메뉴순서는 숫자만 입력 가능합니다.',
    ],
  },
  {
    key: 'url',

    name: '연결URL',
    label: '연결URL',
    placeholder: '연결URL을 입력하세요.',
    disabled: false,
    maxlength: 100,
    counter: true,
    type: 'text',
    autofocus: false,
    color: false,
    message: '연결URL을 확인해주세요.',
    rule: [
      (v: string) => /^[a-zA-Z0-9/\\s]*$/.test(v) || "연결URL은 영문+숫자+'/'만 입력 가능합니다.",
      (v: string) => !(v && v.length > 100) || '연결URL은 100자 이상 입력할 수 없습니다.',
    ],
  },
  {
    key: 'icon',

    name: '메뉴아이콘',
    label: '메뉴아이콘',
    placeholder: '메뉴아이콘을 입력하세요.',
    disabled: false,
    maxlength: 100,
    counter: true,
    type: 'text',
    autofocus: false,
    color: true,
    message: '메뉴아이콘을 확인해주세요.',
    rule: [
      (v: string) => !!v || '메뉴아이콘은 필수 입력사항입니다.',
      (v: string) => /^[a-z-\s]*$/.test(v) || '메뉴아이콘은 영문(소문자)와 -만 입력 가능합니다.',
      (v: string) => !(v && v.length > 100) || '메뉴아이콘은 100자 이상 입력할 수 없습니다.',
    ],
  },
  {
    key: 'active',

    name: '메뉴사용여부',
    label: '메뉴사용여부',
    placeholder: '메뉴사용여부를 입력하세요.',
    disabled: false,
    maxlength: null,
    counter: false,
    type: 'combo',
    autofocus: false,
    color: true,
    message: '메뉴사용여부를 확인해주세요.',
    rule: [
      (v: { value:string }) => typeof v === 'boolean' || '메뉴사용여부를 선택하세요.',
    ],
    appendItems:[{ label:'예',value:true },{ label:'아니오',value:false }],
    itemLabel:'label',
    itemValue:'value',
  },
  {
    key: 'description',

    name: '메뉴설명',
    label: '메뉴설명',
    placeholder: '메뉴설명을 입력하세요.',
    disabled: false,
    maxlength: 100,
    counter: true,
    type: 'text',
    autofocus: false,
    color: false,
    message: '메뉴설명을 확인해주세요.',
    rule: [
      (v: string) => !(v && v.length > 100) || '메뉴설명은 100자 이상 입력할 수 없습니다.',
    ],
  },
  {
    key: 'prevMenuId',

    name: '이전메뉴',
    label: '이전메뉴',
    placeholder: '이전메뉴를 입력하세요.',
    disabled: false,
    maxlength: null,
    counter: false,
    type: 'combo',
    autofocus: false,
    color: false,
    message: '이전메뉴를 확인해주세요.',
    rule: [],
    fetchUrl: '/api/menus?id=all',
    appendItems:[{ id:null,name:'선택' }],
    itemLabel:'name',
    itemValue:'id',
  },
  {
    key: 'nextMenuId',

    name: '다음메뉴',
    label: '다음메뉴',
    placeholder: '다음메뉴를 입력하세요.',
    disabled: false,
    maxlength: null,
    counter: false,
    type: 'combo',
    autofocus: false,
    color: false,
    message: '다음메뉴를 확인해주세요.',
    rule: [],
    fetchUrl: '/api/menus?id=all',
    appendItems:[{ id:null,name:'선택' }],
    itemLabel:'name',
    itemValue:'id',
  },
]
