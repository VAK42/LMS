import { ChevronLeft, Save, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, FileText, Video, File, Edit, Upload, ArrowUp, ArrowDown, Pencil, Check, X, ClipboardList, FileEdit } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import { useToast } from '../../contexts/ToastContext';
import { useState } from 'react';
import LessonContentEditor from '../../components/Editor/LessonContentEditor';
import AssessmentEditor from '../../components/Editor/AssessmentEditor';
import QuizEditor from '../../components/Editor/QuizEditor';
import ImageUpload from '../../components/ImageUpload';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Lesson {
  lessonId: number;
  lessonTitle: string;
  contentType: string;
  durationMinutes: number;
  orderIndex: number;
  contentData?: { path?: string; html?: string; uploaded?: boolean };
}
interface Module {
  moduleId: number;
  moduleTitle: string;
  moduleDescription: string;
  orderIndex: number;
  lessons: Lesson[];
}
interface Course {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  simulatedPrice: number;
  courseImage: string | null;
  categoryId: number;
  isPublished: boolean;
  courseMeta: any;
  modules: Module[];
}
interface Props {
  course: Course;
  categories: { categoryId: number; categoryName: string }[];
  user: any;
}
export default function CourseEdit({ course, categories, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [courseData, setCourseData] = useState({
    courseTitle: course.courseTitle,
    courseDescription: course.courseDescription,
    simulatedPrice: course.simulatedPrice,
    categoryId: course.categoryId,
    courseMeta: course.courseMeta ?? {
      whatYouLearn: [
        t('defaultLearn1'),
        t('defaultLearn2'),
        t('defaultLearn3'),
        t('defaultLearn4'),
      ]
    }
  });
  const [modules, setModules] = useState<Module[]>(course.modules || []);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [addingLesson, setAddingLesson] = useState<number | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState('video');
  const [newLessonDuration, setNewLessonDuration] = useState(10);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState('');
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const [showAssessmentEditor, setShowAssessmentEditor] = useState(false);
  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const handleSaveCourse = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('courseTitle', courseData.courseTitle);
    formData.append('courseDescription', courseData.courseDescription);
    formData.append('categoryId', courseData.categoryId.toString());
    formData.append('simulatedPrice', courseData.simulatedPrice.toString());
    formData.append('courseMeta', JSON.stringify(courseData.courseMeta));
    if (selectedImage) {
      formData.append('courseImage', selectedImage);
    }
    try {
      const response = await fetch(`/api/instructor/courses/${course.courseId}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: formData,
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('failedToSave'));
      showToast(t('courseSavedSuccess'), 'success');
      router.reload();
    } catch (error) {
      showToast(t('courseSaveFailed'), 'error');
    } finally {
      setSaving(false);
    }
  };
  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    try {
      const response = await fetch(`/api/instructor/courses/${course.courseId}/modules`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          moduleTitle: newModuleTitle,
          moduleDescription: '',
          orderIndex: modules.length + 1,
        }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('failedToAddModule'));
      const newModule = await response.json();
      setModules([...modules, { ...newModule, lessons: [] }]);
      setNewModuleTitle('');
      showToast(t('moduleAddedSuccess'), 'success');
    } catch (error) {
      showToast(t('moduleAddFailed'), 'error');
    }
  };
  const handleRenameModule = async (moduleId: number) => {
    if (!editingModuleTitle.trim()) return;
    try {
      const response = await fetch(`/api/instructor/modules/${moduleId}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ moduleTitle: editingModuleTitle }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('failedToRenameModule'));
      setModules(modules.map(m => m.moduleId === moduleId ? { ...m, moduleTitle: editingModuleTitle } : m));
      setEditingModuleId(null);
      showToast(t('moduleRenamedSuccess'), 'success');
    } catch (error) {
      showToast(t('moduleRenameFailed'), 'error');
    }
  };
  const handleMoveModule = async (moduleId: number, direction: 'up' | 'down') => {
    const index = modules.findIndex(m => m.moduleId === moduleId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === modules.length - 1)) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newModules = [...modules];
    [newModules[index], newModules[newIndex]] = [newModules[newIndex], newModules[index]];
    newModules.forEach((m, i) => m.orderIndex = i + 1);
    setModules(newModules);
    try {
      const response = await fetch(`/api/instructor/modules/${moduleId}/reorder`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ direction }),
      });
      if (response.status === 419) { window.location.reload(); return; }
    } catch (error) {
      showToast(t('reorderFailed'), 'error');
    }
  };
  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm(t('deleteModuleConfirm'))) return;
    try {
      const response = await fetch(`/api/instructor/modules/${moduleId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('failedToDeleteModule'));
      setModules(modules.filter(m => m.moduleId !== moduleId));
      showToast(t('moduleDeletedSuccess'), 'success');
    } catch (error) {
      showToast(t('moduleDeleteFailed'), 'error');
    }
  };
  const handleAddLesson = async (moduleId: number) => {
    if (!newLessonTitle.trim()) return;
    const module = modules.find(m => m.moduleId === moduleId);
    try {
      const response = await fetch(`/api/instructor/modules/${moduleId}/lessons`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          lessonTitle: newLessonTitle,
          contentType: newLessonType,
          orderIndex: (module?.lessons.length || 0) + 1,
          durationMinutes: newLessonDuration,
        }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('failedToAddLesson'));
      const newLesson = await response.json();
      setModules(modules.map(m =>
        m.moduleId === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      ));
      setAddingLesson(null);
      setNewLessonTitle('');
      setNewLessonType('video');
      showToast(t('lessonAddedSuccess'), 'success');
    } catch (error) {
      showToast(t('lessonAddFailed'), 'error');
    }
  };
  const handleDeleteLesson = async (moduleId: number, lessonId: number) => {
    if (!confirm(t('deleteLessonConfirm'))) return;
    try {
      const response = await fetch(`/api/instructor/lessons/${lessonId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('failedToDeleteLesson'));
      setModules(modules.map(m =>
        m.moduleId === moduleId ? { ...m, lessons: m.lessons.filter(l => l.lessonId !== lessonId) } : m
      ));
      showToast(t('lessonDeletedSuccess'), 'success');
    } catch (error) {
      showToast(t('lessonDeleteFailed'), 'error');
    }
  };
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-green-700 dark:text-green-400" />;
      case 'pdf': return <File className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default: return <FileText className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />;
    }
  };
  return (
    <Layout user={user}>
      <Head title={t('editCourseWithTitle', { title: course.courseTitle })} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/instructor/dashboard" className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <ChevronLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-serif text-green-950 dark:text-white">{t('editCourseTitle')}</h1>
              <p className="text-zinc-600 dark:text-zinc-400">{course.courseTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowQuizEditor(true)} className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-zinc-800 border border-green-950 dark:border-white text-green-950 dark:text-white rounded font-medium hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors cursor-pointer">
              <ClipboardList className="w-5 h-5" />
              {t('quizButton')}
            </button>
            <button onClick={() => setShowAssessmentEditor(true)} className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-zinc-800 border border-green-950 dark:border-white text-green-950 dark:text-white rounded font-medium hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors cursor-pointer">
              <FileEdit className="w-5 h-5" />
              {t('essayButton')}
            </button>
            <button onClick={handleSaveCourse} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 border border-green-950 dark:border-white rounded hover:bg-white hover:text-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 transition-colors disabled:opacity-50 cursor-pointer">
              <Save className="w-5 h-5" />
              {saving ? t('saving') : t('saveCourse')}
            </button>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-6">
            <h2 className="text-lg text-green-950 dark:text-white mb-4">{t('courseDetails')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm text-green-950 dark:text-white mb-2">{t('courseTitleLabel')}</label>
                <input type="text" value={courseData.courseTitle} onChange={e => setCourseData({ ...courseData, courseTitle: e.target.value })} className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-green-950 dark:text-white mb-2">{t('descriptionLabel')}</label>
                <textarea value={courseData.courseDescription} onChange={e => setCourseData({ ...courseData, courseDescription: e.target.value })} rows={4} className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white" />
              </div>
              <div>
                <label className="block text-sm text-green-950 dark:text-white mb-2">{t('categoryLabel')}</label>
                <select value={courseData.categoryId} onChange={e => setCourseData({ ...courseData, categoryId: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white cursor-pointer">
                  {categories?.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-green-950 dark:text-white mb-2">{t('priceLabel')}</label>
                <input type="number" value={courseData.simulatedPrice} onChange={e => setCourseData({ ...courseData, simulatedPrice: parseFloat(e.target.value) || 0 })} min="0" step="0.01" className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-green-950 dark:text-white mb-2">{t('thumbnail')}</label>
                <ImageUpload
                  currentImage={course.courseImage}
                  onImageSelected={setSelectedImage}
                  label=""
                />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg text-green-950 dark:text-white">{t('courseContent')}</h2>
              <span className="text-sm text-zinc-500">{t('modulesCount', { count: modules.length })} • {t('lessonsCount', { count: modules.reduce((acc, m) => acc + m.lessons.length, 0) })}</span>
            </div>
            <div className="space-y-4">
              {modules.map((module, mIndex) => (
                <div key={module.moduleId} className="border border-green-950 dark:border-white rounded overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800">
                    <div className="flex items-center gap-3 flex-1" onClick={() => editingModuleId !== module.moduleId && toggleModule(module.moduleId)}>
                      {editingModuleId === module.moduleId ? (
                        <div className="flex items-center gap-2 flex-1" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingModuleTitle}
                            onChange={e => setEditingModuleTitle(e.target.value)}
                            className="flex-1 px-3 py-1 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 dark:text-white text-sm"
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && handleRenameModule(module.moduleId)}
                          />
                          <button onClick={() => handleRenameModule(module.moduleId)} className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded cursor-pointer">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingModuleId(null)} className="p-1 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <GripVertical className="w-5 h-5 text-zinc-400 cursor-pointer" />
                          <span className="font-medium text-green-950 dark:text-white cursor-pointer">{module.moduleTitle}</span>
                          <span className="text-sm text-zinc-500">({t('lessonsCount', { count: module.lessons.length })})</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); handleMoveModule(module.moduleId, 'up'); }} disabled={mIndex === 0} className="p-1.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded disabled:opacity-30 cursor-pointer" title={t('moveUp')}>
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleMoveModule(module.moduleId, 'down'); }} disabled={mIndex === modules.length - 1} className="p-1.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded disabled:opacity-30 cursor-pointer" title={t('moveDown')}>
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setEditingModuleId(module.moduleId); setEditingModuleTitle(module.moduleTitle); }} className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded cursor-pointer" title={t('rename')}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteModule(module.moduleId); }} className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded cursor-pointer" title={t('delete')}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div onClick={() => toggleModule(module.moduleId)} className="p-1.5 cursor-pointer">
                        {expandedModules.includes(module.moduleId) ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
                      </div>
                    </div>
                  </div>
                  {expandedModules.includes(module.moduleId) && (
                    <div className="p-4 space-y-2 bg-white dark:bg-zinc-900">
                      {module.lessons.map((lesson, lIndex) => (
                        <div key={lesson.lessonId} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                          <div className="flex items-center gap-3">
                            {getContentIcon(lesson.contentType)}
                            <span className="text-zinc-700 dark:text-zinc-300 font-medium">{lesson.lessonTitle}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditingLesson(lesson)} className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded cursor-pointer" title={lesson.contentData?.path || lesson.contentData?.html || lesson.contentData?.uploaded ? t('editContent') : t('uploadContent')}>
                              {lesson.contentData?.path || lesson.contentData?.html || lesson.contentData?.uploaded ? <Edit className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                            </button>
                            <button onClick={() => handleDeleteLesson(module.moduleId, lesson.lessonId)} className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded cursor-pointer" title={t('delete')}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {addingLesson === module.moduleId ? (
                        <div className="flex flex-wrap items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded border border-green-950 dark:border-white">
                          <input type="text" value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)} placeholder={t('lessonTitlePlaceholder')} className="flex-1 min-w-[200px] px-3 py-2 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 dark:text-white text-sm" />
                          <select value={newLessonType} onChange={e => setNewLessonType(e.target.value)} className="px-3 py-2 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 dark:text-white text-sm cursor-pointer">
                            <option value="video">{t('video')}</option>
                            <option value="text">{t('text')}</option>
                            <option value="pdf">{t('pdf')}</option>
                          </select>
                          <button onClick={() => handleAddLesson(module.moduleId)} className="px-4 py-2 bg-green-950 dark:bg-white text-white dark:text-green-950 rounded text-sm hover:opacity-90 cursor-pointer">{t('add')}</button>
                          <button onClick={() => setAddingLesson(null)} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded text-sm cursor-pointer">{t('cancel')}</button>
                        </div>
                      ) : (
                        <button onClick={() => setAddingLesson(module.moduleId)} className="flex items-center gap-2 w-full p-3 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded border border-dashed border-green-600 dark:border-green-400 cursor-pointer justify-center font-medium">
                          <Plus className="w-4 h-4" />
                          {t('addLesson')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2 p-4 border-2 border-dashed border-green-950 dark:border-white rounded bg-zinc-50 dark:bg-zinc-900">
                <input type="text" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} placeholder={t('newModuleTitlePlaceholder')} className="flex-1 px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-green-950 dark:text-white" />
                <button onClick={handleAddModule} disabled={!newModuleTitle.trim()} className="flex items-center gap-2 px-6 py-2 bg-green-950 dark:bg-white text-white dark:text-green-950 rounded hover:opacity-90 disabled:opacity-50 cursor-pointer">
                  <Plus className="w-5 h-5" />
                  {t('addModule')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {editingLesson && (
        <LessonContentEditor
          isOpen={!!editingLesson}
          onClose={() => setEditingLesson(null)}
          lesson={editingLesson}
          onSaved={(lessonId) => {
            setModules(prevModules => prevModules.map(m => ({
              ...m,
              lessons: m.lessons.map(l => l.lessonId === lessonId ? { ...l, contentData: { uploaded: true } as any } : l)
            })));
          }}
        />
      )}
      <QuizEditor
        isOpen={showQuizEditor}
        onClose={() => setShowQuizEditor(false)}
        courseId={course.courseId}
      />
      <AssessmentEditor
        isOpen={showAssessmentEditor}
        onClose={() => setShowAssessmentEditor(false)}
        courseId={course.courseId}
      />
    </Layout>
  )
}