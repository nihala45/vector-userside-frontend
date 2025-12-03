/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { cn } from '@repo/ui/lib/utils'
import {
	ChevronDown,
	Menu,
	Plus,
	Settings,
	User,
	LogOut,
	Bell,
	LayoutDashboard,
	ShoppingCart,
	Package,
	TruckIcon,
	RotateCcw,
	Activity,
	Warehouse,
	Eye,
	BarChart3,
	List,
	PackageCheck,
	Send,
	UserCheck,
	Crown,
	ShieldCheck,
	Users,
	Shield,
	Gift,
	Star,
	PenTool,
	Globe,
	Target,
	ChevronRight,
} from 'lucide-react'
import { Button } from '@repo/ui/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { Sidebar } from './sidebar.js'
import { navigation } from '../../../src/lib/SidebarItems.js'
import { useAuthStore } from '../../../src/store/AuthStore.js'

interface LayoutWrapperProps {
	children: React.ReactNode
}

type PageInfo = {
	name: string
	icon: any
	parentName?: string
	parentIcon?: any
}

// 🔎 helper to find current page (supports parent > child & dynamic paths)
const findCurrentPage = (
	items: typeof navigation,
	pathname: string
): PageInfo | null => {
	for (const item of items) {
		// If exact match or starts with parent href
		if (item.href === pathname || pathname.startsWith(item.href + '/')) {
			return { name: item.name, icon: item.icon }
		}

		if (item.children) {
			for (const child of item.children) {
				// Exact match for child or dynamic child (like /warehouse/wh001)
				if (child.href === pathname || pathname.startsWith(child.href + '/')) {
					return {
						name: child.name,
						icon: child.icon,
						parentName: item.name,
						parentIcon: item.icon,
					}
				}
			}
		}
	}
	return null
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [isCollapsed, setIsCollapsed] = useState(false)
	const location = useLocation()
	const navigate = useNavigate();
	const admin = useAuthStore(state => state.admin)

	const noLayoutRoutes = ['/', '/login', '/register']

	if (noLayoutRoutes.includes(location.pathname)) {
		return <>{children}</>
	}

	const currentPage = findCurrentPage(navigation, location.pathname) || {
		name: 'Dashboard',
		icon: LayoutDashboard,
	}

	const PageIcon = currentPage.icon
	const ParentIcon = currentPage.parentIcon

	return (
		<div className='flex h-screen bg-gray-50 font-[var(--font-oswald)]'>
			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<Sidebar
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				isCollapsed={isCollapsed}
				onToggle={() => setIsCollapsed(!isCollapsed)}
			/>

			<div
				className={cn(
					'flex-1 flex flex-col overflow-hidden transition-all duration-300',
					isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
				)}
			>
				<header className='bg-white border-b border-gray-200 px-4 py-3'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-4'>
							<Button
								variant='ghost'
								size='sm'
								className='lg:hidden'
								onClick={() => setSidebarOpen(true)}
							>
								<Menu className='h-5 w-5' />
							</Button>

							{/* Page Title */}
							<div className='flex items-center gap-2'>
								{currentPage.parentName ? (
									<>
										{ParentIcon && (
											<ParentIcon className='h-5 w-5 text-gray-500' />
										)}
										<span className='text-lg font-medium text-gray-700'>
											{currentPage.parentName}
										</span>
										<ChevronRight />
										{/* <PageIcon className="h-5 w-5 text-gray-500" /> */}
										<span className='text-lg font-medium text-gray-900'>
											{currentPage.name}
										</span>
									</>
								) : (
									<>
										<PageIcon className='h-5 w-5 text-gray-500' />
										<span className='text-lg font-medium text-gray-900'>
											{currentPage.name}
										</span>
									</>
								)}
							</div>
						</div>

						{/* Profile Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									className='flex items-center gap-3 h-auto p-2 hover:bg-gray-50'
								>
									<Avatar className='h-8 w-8'>
										<AvatarImage src='/placeholder.svg?height=32&width=32' />
										<AvatarFallback>AD</AvatarFallback>
									</Avatar>
									<div className='hidden sm:block text-left'>
										<p className='text-sm font-medium'>
											{admin?.fullName || 'Admin'}
										</p>
										<p className='text-xs text-gray-500'>
											{admin?.email || 'admin@caremall.in'}
										</p>
									</div>
									<ChevronDown className='h-4 w-4 text-gray-500' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='w-56'>
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />

								<DropdownMenuItem onClick={() => navigate("/profile")}>
																	<User className='mr-2 h-4 w-4' />
																	<span>Profile</span>
																</DropdownMenuItem>
								{/* <DropdownMenuItem>
									<User className='mr-2 h-4 w-4' />
									<span>Profile</span>
								</DropdownMenuItem> */}
								<DropdownMenuItem onClick={() => navigate("/dashboard")}>
									<Bell className='mr-2 h-4 w-4' />
									<span>Notifications</span>
								</DropdownMenuItem>
								{/* <DropdownMenuItem>
									<Settings className='mr-2 h-4 w-4' />
									<span>Settings</span>
								</DropdownMenuItem> */}
								<DropdownMenuSeparator />
								<DropdownMenuItem className='text-red-600' onClick={() => navigate("/")}>
									<LogOut className='mr-2 h-4 w-4' />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</header>
				{location.pathname === '/dashboard' && (
					<div className='bg-white border-b border-gray-200 px-4 py-3'>
						{/* <div className='flex flex-wrap items-center gap-2'>
							<span className='text-sm font-medium text-gray-700 mr-2'>
								Quick Actions:
							</span>
							<Button
								variant='outline'
								size='sm'
								className='text-xs bg-transparent'
							>
								📋 Generate Pick List
							</Button>
							<Button
								variant='outline'
								size='sm'
								className='text-xs bg-transparent'
							>
								👁️ View Return Requests
							</Button>
							<Button
								variant='outline'
								size='sm'
								className='text-xs bg-transparent'
							>
								🖨️ Print Dispatch Sheet
							</Button>
							<Button size='sm' className='bg-red-600 hover:bg-red-700 text-xs'>
								<Plus className='h-3 w-3 mr-1 text-white' />
								Add New Inventory
							</Button>
						</div> */}
					</div>
				)}

				{/* Page content */}
				<div className='flex-1 overflow-auto p-5'>{children}</div>
			</div>
		</div>
	)
}
