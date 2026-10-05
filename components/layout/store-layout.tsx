import type { ReactNode } from "react";import { SiteFooter } from "./site-footer";import { SiteHeader } from "./site-header";import { getRequestRegion } from "@/lib/region/server";
export async function StoreLayout({children}:{children:ReactNode}){const region=await getRequestRegion();return <><SiteHeader initialRegion={region}/><main>{children}</main><SiteFooter/></>}
