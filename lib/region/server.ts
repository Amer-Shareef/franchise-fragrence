import { cookies, headers } from "next/headers";
import { regions } from "@/config/regions";
import type { RegionCode } from "@/types/product";
const cookieName="ff-region";
export async function getRequestRegion():Promise<RegionCode>{const cookieStore=await cookies();const saved=cookieStore.get(cookieName)?.value as RegionCode|undefined;if(saved&&regions.some((region)=>region.code===saved))return saved;const country=(await headers()).get("x-vercel-ip-country")?.toUpperCase();return regions.find((region)=>region.countryCodes.includes(country??""))?.code??"INTL"}
