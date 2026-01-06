import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        navigate("/admin");
        return;
      }

      setAuthed(true);

      if (requireAdmin) {
        // Check admin role
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        setIsAdmin(!!data);
      }

      setLoading(false);
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          navigate("/admin");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!authed) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
