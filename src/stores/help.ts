import { useCreate } from '@/hooks/useCreate'
import { useDelete } from '@/hooks/useDelete'
import { useSearch } from '@/hooks/useSearch'
import { useUpdate } from '@/hooks/useUpdate'
import type { HelpDto } from '@/types/api/help.dto'
import { defineStore } from 'pinia'

export const useHelpStore = defineStore('help', () => {
  // ──────────────────────────────────────────────────────────────
  // 1) 검색(Read) 훅
  const { data: helpDetail, fetch: fetchHelpDetail } = useSearch<HelpDto>('/api/helps')

  // ──────────────────────────────────────────────────────────────
  // 2) 생성/수정/삭제(CUD) 훅
  const {
    mutate: createHelp,
    isSuccess: isCreating,
    errorMessage: createError,
  } = useCreate<HelpDto>('/api/helps')

  const {
    mutate: updateHelp,
    isSuccess: isUpdating,
    errorMessage: updateError,
  } = useUpdate<HelpDto>('/api/helps')

  const {
    mutate: deleteHelp,
    isSuccess: isDeleting,
    errorMessage: deleteError,
  } = useDelete('/api/helps')

  const {
    mutate: deleteHelpImage,
    isSuccess: isImageDeleting,
    errorMessage: imageDeleteError,
  } = useDelete('/api/helps/images')

  // ──────────────────────────────────────────────────────────────
  // 3) 스토어 액션 래퍼
  async function loadHelp (menuId: number) {
    await fetchHelpDetail({ params: { menuId } })
  }

  async function addHelp (payload: HelpDto, menuId:number) {
    await createHelp(payload)
    if(!isCreating){
      alert(createError)
      console.error(createError)
    }
    await loadHelp(menuId)
  }

  async function editHelp (payload: HelpDto, menuId:number) {
    await updateHelp(payload.helpId, payload)
    if(!isUpdating){
      alert(updateError)
      console.error(updateError)
    }
    await loadHelp(menuId)
  }

  async function removeHelp (id: number, menuId: number) {
    await deleteHelp(id)
    if(!isDeleting){
      alert(deleteError)
      console.error(deleteError)
    }
    await loadHelp(menuId)
  }

  async function removeHelpImage (helpId: number, imageId: number) {
  // REST endpoint: DELETE /api/helps/{helpId}/images/{imageId}
    await deleteHelpImage(`${helpId}/images/${imageId}`)
    if(!isImageDeleting){
      alert(imageDeleteError)
      console.error(imageDeleteError)
    }
    await loadHelp(helpId)
  }

  // ──────────────────────────────────────────────────────────────
  // 4) 스토어 공개 API
  return {
    // state

  }
})
