import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Award, BookOpen, FileDown, LayoutGrid, List, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { publicApi } from '../../lib/publicApi';

/**
 * Renders leadership cards and employee grid with independent view toggles.
 * Leaders: card view (detailed, clickable) ↔ table view
 * Employees: avatar grid ↔ list view
 */
export function TeamGrid({ showHeader = true }) {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderView, setLeaderView] = useState('card');   // 'card' | 'table'
  const [empView, setEmpView] = useState('grid');   // 'grid' | 'list'

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await publicApi.get('/employee/getAllTeamMembers');
        const teamData = res.data?.data?.teamMembers || [];
        const live = teamData.filter((m) => m.isLive);
        setLeaders(live.filter((m) => m.isLeader));
        setEmployees(live.filter((m) => !m.isLeader));
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  // ── Reusable icon-only toggle pill ──────────────────────────────────────────
  function ViewToggle({ value, onChange, options }) {
    return (
      <div className="flex items-center gap-1 bg-brand-bg border border-brand-border rounded-lg p-1 shadow-sm">
        {options.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            title={label}
            className={`w-9 h-9 flex items-center justify-center rounded-md transition-all duration-200 ${value === key
              ? 'bg-white shadow text-brand-green border border-brand-border/60'
              : 'text-brand-gray hover:text-brand-green hover:bg-white/60'
              }`}
          >
            <Icon size={17} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">

        {showHeader && (
          <SectionHeader
            tag="Our Leadership"
            title="Board of Directors"
            subtitle="Meet our founding partners, bringing together over six decades of combined engineering expertise, certified academic credentials, and robust execution records."
          />
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green" />
          </div>
        ) : (
          <>
            {/* ══ LEADERSHIP SECTION ══════════════════════════════════════════ */}
            {leaders.length > 0 && (
              <div className="mb-16">
                {/* Section header row */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold font-display text-brand-black">Leadership</h3>
                    <p className="text-sm text-brand-gray font-body mt-0.5">
                      {leaders.length} director{leaders.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ViewToggle
                    value={leaderView}
                    onChange={setLeaderView}
                    options={[
                      { key: 'card', icon: LayoutGrid, label: 'Card View' },
                      { key: 'table', icon: List, label: 'Table View' },
                    ]}
                  />
                </div>

                {/* ── Card view ── */}
                {leaderView === 'card' && (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(560px,1fr))] gap-10">
                    {leaders.map((director) => (
                      <Card
                        key={director._id}
                        className="flex flex-col sm:flex-row h-full overflow-hidden p-0 cursor-pointer border border-brand-border/60 hover:border-brand-green/60 hover:shadow-2xl shadow-md transition-all duration-300 rounded-2xl"
                        hoverEffect={true}
                        onClick={() => navigate(`/team/${director._id}`)}
                      >
                        {/* Photo — left side, fills full height */}
                        <div className="w-full sm:w-72 shrink-0 overflow-hidden bg-brand-bg relative group min-h-[280px] sm:min-h-full">
                          {director.image?.url ? (
                            <img
                              src={director.image.url}
                              alt={director.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                              No Image
                            </div>
                          )}

                          {/* Gradient wash for legibility */}
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent pointer-events-none" />

                          <div className="absolute bottom-4 left-4 bg-brand-black/80 backdrop-blur-sm px-3 py-1.5 rounded-md text-white text-xs font-semibold flex items-center gap-1.5">
                            <MapPin size={13} className="text-brand-green" />
                            <span>{director.location?.split(',')[0]}</span>
                          </div>
                        </div>

                        {/* Details — right side */}
                        <div className="p-8 flex flex-col flex-grow">
                          <div className="mb-5">
                            <h3 className="text-2xl font-bold font-display text-brand-black mb-1.5 leading-tight">
                              {director.name}
                            </h3>
                            <p className="text-sm font-bold text-brand-green font-body uppercase tracking-wider">
                              {director.designation}
                            </p>
                          </div>

                          <div className="flex gap-2.5 mb-5">
                            <BookOpen size={16} className="text-brand-green shrink-0 mt-0.5" />
                            <p className="text-sm text-brand-gray font-body leading-relaxed">
                              {director.qualification}
                            </p>
                          </div>

                          {director.specializations?.length > 0 && (
                            <div className="mb-6 flex-grow">
                              <span className="text-xs font-bold text-brand-black uppercase tracking-wider block mb-3 font-display">
                                Key Specialties
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {director.specializations.slice(0, 3).map((spec, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 text-xs text-brand-gray font-body bg-brand-bg border border-brand-border/50 rounded-full px-3 py-1.5"
                                  >
                                    <Award size={12} className="text-brand-green shrink-0" />
                                    <span>{spec}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {director.keyProjects?.length > 0 && (
                            <div className="border-t border-brand-border/60 pt-5 mb-5">
                              <span className="text-xs font-bold text-brand-black uppercase tracking-wider block mb-2 font-display">
                                Notable Project
                              </span>
                              <p className="text-sm font-body text-brand-gray italic leading-relaxed line-clamp-2">
                                "{director.keyProjects[0]}"
                              </p>
                            </div>
                          )}

                          <div className="border-t border-brand-border/60 pt-5 mt-auto flex flex-col gap-2.5 font-body text-sm text-brand-gray">
                            <a
                              href={`mailto:${director.email}`}
                              className="flex items-center gap-2 hover:text-brand-green transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail size={15} className="text-brand-green" />
                              <span className="truncate">{director.email}</span>
                            </a>

                            <a
                              href={`tel:+91${director.phone}`}
                              className="flex items-center gap-2 hover:text-brand-green transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone size={15} className="text-brand-green" />
                              <span>+91 {director.phone}</span>
                            </a>

                            {director.resume?.url && (
                              <a
                                href={director.resume.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 font-semibold text-brand-green hover:text-brand-green-hover transition-colors mt-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FileDown size={15} />
                                <span>Download Resume (PDF)</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* ── Table view ── */}
                {leaderView === 'table' && (
                  <div className="overflow-x-auto bg-white border border-brand-border rounded-xl shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-brand-bg text-brand-gray text-xs uppercase tracking-wider font-body border-b border-brand-border">
                          <th className="p-4 font-semibold">Name</th>
                          <th className="p-4 font-semibold">Designation</th>
                          <th className="p-4 font-semibold">Qualification</th>
                          <th className="p-4 font-semibold">Location</th>
                          <th className="p-4 font-semibold">Contact</th>
                          <th className="p-4 font-semibold"></th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-body divide-y divide-brand-border/50">
                        {leaders.map((director) => (
                          <tr
                            key={director._id}
                            className="hover:bg-brand-bg/40 transition-colors cursor-pointer group"
                            onClick={() => navigate(`/team/${director._id}`)}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-brand-border/40">
                                  {director.image?.url ? (
                                    <img src={director.image.url} alt={director.name} className="w-full h-full object-cover object-top" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">{director.name?.charAt(0)}</div>
                                  )}
                                </div>
                                <span className="font-bold text-brand-black group-hover:text-brand-green transition-colors">{director.name}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-brand-green font-semibold text-xs uppercase tracking-wide">{director.designation}</span>
                            </td>
                            <td className="p-4 text-brand-gray max-w-[220px]">
                              <span className="line-clamp-2 text-xs">{director.qualification}</span>
                            </td>
                            <td className="p-4 text-brand-gray whitespace-nowrap">
                              <span className="flex items-center gap-1"><MapPin size={12} className="text-brand-green shrink-0" />{director.location?.split(',')[0]}</span>
                            </td>
                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                              <div className="flex flex-col gap-1">
                                {director.email && (
                                  <a href={`mailto:${director.email}`} className="flex items-center gap-1.5 text-xs text-brand-gray hover:text-brand-green transition-colors">
                                    <Mail size={12} className="text-brand-green" />{director.email}
                                  </a>
                                )}
                                {director.phone && (
                                  <a href={`tel:+91${director.phone}`} className="flex items-center gap-1.5 text-xs text-brand-gray hover:text-brand-green transition-colors">
                                    <Phone size={12} className="text-brand-green" />+91 {director.phone}
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-brand-green whitespace-nowrap">
                                View Profile →
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ══ EMPLOYEES SECTION ═══════════════════════════════════════════ */}
            {employees.length > 0 && (
              <div>
                {/* Section header row */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold font-display text-brand-black">Our Team</h3>
                    <p className="text-sm text-brand-gray font-body mt-0.5">
                      The dedicated professionals driving our projects.
                    </p>
                  </div>
                  <ViewToggle
                    value={empView}
                    onChange={setEmpView}
                    options={[
                      { key: 'grid', icon: LayoutGrid, label: 'Grid View' },
                      { key: 'list', icon: List, label: 'List View' },
                    ]}
                  />
                </div>

                {/* ── Card grid view (2×2) ── */}
                {empView === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {employees.map((employee) => (
                      <div
                        key={employee._id}
                        className="flex flex-row overflow-hidden rounded-2xl border border-brand-border/60 bg-white shadow-sm hover:shadow-lg hover:border-brand-green/40 transition-all duration-300 cursor-pointer"
                        onClick={() => navigate(`/team/${employee._id}`)}
                      >
                        {/* Image — left side */}
                        <div className="w-40 sm:w-48 shrink-0 bg-brand-bg relative overflow-hidden group">
                          {employee.image?.url ? (
                            <img
                              src={employee.image.url}
                              alt={employee.name}
                              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gray-100 text-gray-400">
                              <User size={48} strokeWidth={1.2} />
                            </div>
                          )}
                        </div>

                        {/* Details — right side */}
                        <div className="p-6 flex flex-col justify-center flex-grow min-w-0">
                          <h4 className="text-lg font-bold font-display text-brand-black leading-snug mb-1">
                            {employee.name}
                          </h4>
                          <p className="text-sm font-semibold text-brand-green font-body uppercase tracking-wide mb-4">
                            {employee.designation}
                          </p>

                          <div className="flex flex-col gap-2 font-body text-sm text-brand-gray">
                            {employee.location && (
                              <span className="flex items-center gap-2">
                                <MapPin size={14} className="text-brand-green shrink-0" />
                                <span className="truncate">{employee.location}</span>
                              </span>
                            )}
                            {employee.email && (
                              <a
                                href={`mailto:${employee.email}`}
                                className="flex items-center gap-2 hover:text-brand-green transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Mail size={14} className="text-brand-green shrink-0" />
                                <span className="truncate">{employee.email}</span>
                              </a>
                            )}
                            {employee.phone && (
                              <a
                                href={`tel:+91${employee.phone}`}
                                className="flex items-center gap-2 hover:text-brand-green transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Phone size={14} className="text-brand-green shrink-0" />
                                <span>+91 {employee.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── List view ── */}
                {empView === 'list' && (
                  <div className="overflow-x-auto bg-white border border-brand-border rounded-xl shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[480px]">
                      <thead>
                        <tr className="bg-brand-bg text-brand-gray text-xs uppercase tracking-wider font-body border-b border-brand-border">
                          <th className="p-4 font-semibold">Name</th>
                          <th className="p-4 font-semibold">Designation</th>
                          <th className="p-4 font-semibold">Location</th>
                          <th className="p-4 font-semibold">Contact</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-body divide-y divide-brand-border/50">
                        {employees.map((employee) => (
                          <tr key={employee._id} className="hover:bg-brand-bg/40 transition-colors cursor-pointer group" onClick={() => navigate(`/team/${employee._id}`)}>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-brand-border/40">
                                  {employee.image?.url ? (
                                    <img src={employee.image.url} alt={employee.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-sm">
                                      {employee.name?.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <span className="font-bold text-brand-black">{employee.name}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-brand-green font-semibold text-xs uppercase tracking-wide">{employee.designation}</span>
                            </td>
                            <td className="p-4 text-brand-gray">
                              {employee.location ? (
                                <span className="flex items-center gap-1 text-xs"><MapPin size={12} className="text-brand-green shrink-0" />{employee.location}</span>
                              ) : (
                                <span className="text-brand-gray/40 text-xs">—</span>
                              )}
                            </td>
                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                              <div className="flex flex-col gap-1">
                                {employee.email ? (
                                  <a href={`mailto:${employee.email}`} className="flex items-center gap-1.5 text-xs text-brand-gray hover:text-brand-green transition-colors">
                                    <Mail size={12} className="text-brand-green" />{employee.email}
                                  </a>
                                ) : (
                                  <span className="flex items-center gap-1.5 text-xs text-brand-gray/40">
                                    <User size={12} />—
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {leaders.length === 0 && employees.length === 0 && (
              <div className="text-center py-20 border border-dashed border-brand-border rounded-xl bg-brand-bg">
                <p className="font-body text-brand-gray text-base">No team members found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
export default TeamGrid;
