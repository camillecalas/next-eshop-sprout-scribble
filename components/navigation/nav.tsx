import {auth} from '@/server/auth'
import { UserButton } from './user-button'
import Logo from '@/components/navigation/logo'
import Link from 'next/link'


export default async function Nav() {
	const session = await auth()

	return (
		<header className='py-8'>
			<nav>
				<ul className='flex justify-between items-center'>
					<li>
						<Link href={'/'} aria-label="sprout and scribble logo">
							<Logo/>
						</Link>
					</li>
					<li><UserButton 
							expires={session?.expires as string} 
							user={session?.user}/>
					</li>
				</ul>
			</nav>

		</header>
	)
}