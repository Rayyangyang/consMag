import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const Layout = () => import("@/layout/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/roleManage",
    component: Layout,
    redirect: "/roleManage/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/roleManage/Index.vue"),
        name: "RoleManage",
        meta: {
          title: "角色管理"
        }
      }
    ]
  },
  {
    path: "/userManage",
    component: Layout,
    redirect: "/userManage/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/userManage/Index.vue"),
        name: "UserManage",
        meta: {
          title: "人员管理"
        }
      }
    ]
  },
  {
    path: "/projectDirectory",
    component: Layout,
    redirect: "/projectDirectory/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/projectDirectory/index.vue"),
        name: "ProjectDirectory",
        meta: {
          title: "项目目录"
        }
      }
    ]
  },
  {
    path: "/farmerMoney",
    component: Layout,
    redirect: "/farmerMoney/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/farmerMoney/Index.vue"),
        name: "FarmerMoney",
        meta: {
          title: "农民工工资"
        }
      }
    ]
  },
  {
    path: "/userFiles",
    component: Layout,
    redirect: "/userFiles/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/userFiles/Index.vue"),
        name: "UserFiles",
        meta: {
          title: "人员档案"
        }
      }
    ]
  },
  {
    path: "/projectCheck",
    component: Layout,
    redirect: "/projectCheck/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/projectCheck/Index.vue"),
        name: "ProjectCheck",
        meta: {
          title: "项目检查"
        }
      }
    ]
  },
  {
    path: "/clockIn",
    component: Layout,
    redirect: "/clockIn/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/clockIn/Index.vue"),
        name: "ClockIn",
        meta: {
          title: "打卡"
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

console.log(1999888, constantRoutes)
const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  console.log(10000)
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
