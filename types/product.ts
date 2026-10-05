export type RegionCode="LK"|"AE"|"INTL";
export type Gender="Men"|"Women"|"Unisex";
export type Product={slug:string;name:string;brand:string;gender:Gender;family?:string;concentration?:string;shortDescription:string;description?:string;notes?:{top?:string[];heart?:string[];base?:string[]};sizes:string[];price?:Record<RegionCode,{price?:number;originalPrice?:number;available:boolean}>;image?:{url:string;alt?:string};badges?:string[];accent:string};
