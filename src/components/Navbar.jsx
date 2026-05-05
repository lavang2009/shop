import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShoppingBag, ShieldCheck, UserCircle2, LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-2xl px-4 py-2 text-sm font-medium transition",
    isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const { itemCount } = useCart();
  const role = profile?.role || "customer";
  const isStaff = ["admin", "seller"].includes(role);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl">
      <div className="section-shell">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-soft">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">FreshGlow Store</p>
              <p className="text-xs text-slate-500">Sữa rửa mặt chuyên nghiệp</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            <NavLink to="/" className={navLinkClass} end>
              Trang chủ
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Sản phẩm
            </NavLink>
            <NavLink to="/categories" className={navLinkClass}>
              Bộ sưu tập
            </NavLink>
            {user ? (
              <>
                <NavLink to="/cart" className={navLinkClass}>
                  Giỏ hàng ({itemCount})
                </NavLink>
                <NavLink to="/orders" className={navLinkClass}>
                  Đơn hàng
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  Trang cá nhân
                </NavLink>
                {isStaff ? (
                  <NavLink to="/admin" className={navLinkClass}>
                    Trang quản trị
                  </NavLink>
                ) : null}
                {isStaff ? (
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                    {role.toUpperCase()}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  <UserCircle2 className="h-4 w-4" />
                  {profile?.displayName || user.displayName || "Người dùng"}
                </span>
                <button onClick={logout} className="btn-secondary">
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Đăng nhập
                </NavLink>
                <NavLink to="/register" className={navLinkClass}>
                  Đăng ký
                </NavLink>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <NavLink to="/cart" className="btn-secondary !px-3 !py-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-xs">{itemCount}</span>
            </NavLink>
            <button className="btn-secondary !px-3 !py-2" onClick={() => setOpen((value) => !value)}>
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="border-t border-slate-200 bg-white lg:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="section-shell py-4">
              <div className="grid gap-2">
                {[
                  ["/", "Trang chủ"],
                  ["/products", "Sản phẩm"],
                  ["/categories", "Bộ sưu tập"],
                  ["/about", "Giới thiệu"],
                  ["/contact", "Liên hệ"],
                  ["/faq", "FAQ"],
                  ["/policies", "Chính sách"],
                ].map(([to, label]) => (
                  <NavLink key={to} to={to} onClick={closeMenu} className={navLinkClass}>
                    {label}
                  </NavLink>
                ))}
                {user ? (
                  <>
                    <NavLink to="/profile" onClick={closeMenu} className={navLinkClass}>
                      Trang cá nhân
                    </NavLink>
                    <NavLink to="/cart" onClick={closeMenu} className={navLinkClass}>
                      Giỏ hàng
                    </NavLink>
                    <NavLink to="/orders" onClick={closeMenu} className={navLinkClass}>
                      Đơn hàng
                    </NavLink>
                    {isStaff ? (
                      <NavLink to="/admin" onClick={closeMenu} className={navLinkClass}>
                        Trang quản trị
                      </NavLink>
                    ) : null}
                    <button
                      onClick={async () => {
                        closeMenu();
                        await logout();
                      }}
                      className="btn-primary mt-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" onClick={closeMenu} className={navLinkClass}>
                      Đăng nhập
                    </NavLink>
                    <NavLink to="/register" onClick={closeMenu} className={navLinkClass}>
                      Đăng ký
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
